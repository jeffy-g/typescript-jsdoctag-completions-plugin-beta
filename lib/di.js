/*!
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  Copyright (C) 2020 jeffy-g <hirotom1107@gmail.com>
  Released under the MIT license
  https://opensource.org/licenses/mit-license.php
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
*/
/// <reference path="./preset-api.d.ts"/>
/**
 * @file jsdoc tag preset composer
 * @author jeffy-g <hirotom1107@gmail.com>
 * @version 4.1
 */
const logger = require("./logger");
/**
 * Remove the built-in object prototype
 *
 * @param {Record<string, string>} map
 * @returns {Record<string, string>}
 */
function eliminateCopy(map) {
    /** @type {Record<string, string>} */
    const copy = Object.create(null);
    for (let index = 0, keys = Object.keys(map), end = keys.length; index < end;) {
        const key = keys[index++];
        copy[key] = map[key];
    }
    return copy;
}
/* eslint-disable @typescript-eslint/array-type */
/**
 * purge object prototype
 *
 * @param {JSDocTagPresetAPI.TTranslationsMap} translations
 */
function purgeTranslationData(translations) {
    const locales =
    /** @type {JSDocTagPresetAPI.TPresetLocaleTokens[]} */ (Object.keys(translations));
    for (let i = 0, end = locales.length; i < end;) {
        const locale = locales[i++];
        const entry = translations[locale];
        const copy = {};
        copy.blockDocs = eliminateCopy(entry.blockDocs);
        copy.inlineDocs = eliminateCopy(entry.inlineDocs);
        translations[locale] = copy;
    }
}
/**
 * purge object prototype
 *
 * @param {JSDocTagPresetAPI.TSyntaxMap} data
 */
function purgeSyntaxData(data) {
    data.block = eliminateCopy(data.block);
    data.inline = eliminateCopy(data.inline);
}
/**
 * @param {JSDocTagPresetAPI.TJSDocTagRawPreset} rawPreset
 * @param {JSDocTagPresetAPI.TTranslationsMap} translations
 * @param {JSDocTagPresetAPI.TSyntaxMap} syntaxMap
 * @param {JSDocTagPresetAPI.TSynonymsMap} synonymsMap synonyms cache object
 * @returns {ReadonlyArray<string>[]}
 * @version 4.0
 */
function expandPresetData(rawPreset, translations, syntaxMap, synonymsMap) {
    let i = 0;
    /** @type {JSDocTagPresetAPI.TTagKindToken[]} */
    const tagKindTokens = ["block", "inline"];
    /** @type {ReadonlyArray<string>[]} */
    const result = [];
    do {
        const tagKindToken = tagKindTokens[i];
        const kindToken4Translation =
        /** @type {JSDocTagPresetAPI.TTagKindToken<"Docs">} */ (tagKindToken + "Docs");
        const syntaxes = syntaxMap[tagKindToken];
        const names = rawPreset.provideTagData((tagKindToken === "block") || void 0).slice(0);
        for (let nameIndex = 0, end = names.length; nameIndex < end;) {
            let name = names[nameIndex++];
            if (name.indexOf(":") > 0) {
                let syms;
                [name, syms] = name.split(":");
                names[nameIndex - 1] = name;
                const reTag = new RegExp(`@${name}`, "g");
                const syntax = syntaxes[name];
                const synonyms = syms.split(",");
                synonymsMap[tagKindToken][name] = synonyms;
                for (const synonym of synonyms) {
                    names.push(synonym);
                    if (syntax) {
                        syntaxes[synonym] = syntax.replace(reTag, `@${synonym}`);
                    }
                }
                for (const translation of Object.values(translations)) {
                    const docs = translation[kindToken4Translation];
                    const doc = docs[name];
                    if (doc) {
                        for (const synonym of synonyms) {
                            docs[synonym] = doc;
                        }
                    }
                }
            }
        }
        names.sort();
        Object.freeze(names);
        result[i++] = names;
    } while (i < 2);
    return result;
}
/**
 * @param {string} syntax the syntax for snippet
 * @returns {string}
 * @date 2022/3/1
 */
function toSnippet(syntax) {
    if (syntax.indexOf("\n") !== -1) {
        syntax = syntax.split("\n")[0];
    }
    syntax = syntax.replace(/@|\[|\]/g, "");
    let idx = 1;
    return syntax.replace(/<([\w\s\|=?]+)>/g, ($0, $1) => {
        if ($1.indexOf("|") !== -1) {
            return `\${${idx++}|${$1.split("|")}|}`;
        }
        return `\${${idx++}:${$1}}`;
    });
}
/**
 * @param {ReadonlyArray<string>} nameData
 * @param {JSDocTagPresetAPI.TTranslationsMap} translations
 * @param {JSDocTagPresetAPI.TSyntaxMap} syntaxMap
 * @param {JSDocTagPresetAPI.TSynonymsMap} synonymsMap
 * @param {true} [isBlock]
 * @returns {JSDocTagPresetAPI.TJSDocTagPresetEntry[]}
 * @see above {@linkplain toSnippet}
 * @date 2022/3/1 support snippet feature!
 */
function createPresetEntries(nameData, translations, syntaxMap, synonymsMap, isBlock) {
    /** @type {JSDocTagPresetAPI.TJSDocTagPresetEntry[]} */
    const entries = [];
    const tagKindToken = isBlock ? "block" : "inline";
    const kindToken4Translation =
    /** @type {keyof JSDocTagPresetAPI.TTranslationMap} */ (tagKindToken + "Docs");
    const syntaxes = syntaxMap[tagKindToken];
    const symMap = synonymsMap[tagKindToken];
    logger.log(`createPresetEntries:debugDump, synonymsMap=[${JSON.stringify(symMap, null, 2)}]`);
    /**
     * @type {function(this: JSDocTagPresetAPI.TJSDocTagPresetEntry, JSDocTagPresetAPI.TPresetLocaleTokens): string | undefined}
     */
    const document = function (locale = "en") {
        logger.log(`JSDocTagPresetEntry.document, tagName=${this.name} locale=[${locale}]`);
        const tr = translations[locale];
        if (tr) {
            const section = tr[kindToken4Translation];
            return section[this.name];
        }
    };
    for (let index = 0, end = nameData.length; index < end;) {
        const name = nameData[index];
        const nullobj =
        /** @type {Writable<JSDocTagPresetAPI.TJSDocTagPresetEntry>} */ (Object.create(null));
        nullobj.name = name;
        nullobj.synonyms = symMap[name];
        const syntax = syntaxes[name];
        if (typeof syntax === "string") {
            let snippet = toSnippet(syntax);
            if (!isBlock) {
                snippet = snippet.slice(1, snippet.length - 1);
            }
            nullobj.snippet = snippet;
            nullobj.syntax = syntax;
        }
        nullobj.document = document;
        entries[index++] = Object.freeze(nullobj);
    }
    return entries;
}
/**
 * Hide the implementation of Preset interface by javascript's Closure
 *
 *  + The preset instance constructed by this function should be used as a cache
 *
 * @param {JSDocTagPresetAPI.TJSDocTagRawPreset} rawPreset must be singleton instance
 * @param {JSDocTagPresetAPI.TTranslationsMap} translations
 * @param {JSDocTagPresetAPI.TSyntaxMap} syntaxData
 * @returns {JSDocTagPresetAPI.IJSDocTagPresetProvider}
 */
function injectDependencies(rawPreset, translations, syntaxData) {
    /** @type {ReadonlyArray<JSDocTagPresetAPI.TJSDocTagPresetEntry>[]} */
    let entriesSlot = [];
    /**
     * @type {JSDocTagPresetAPI.TSynonymsMap}
     */
    const synonymsMap = {
        block: Object.create(null),
        inline: Object.create(null)
    };
    purgeTranslationData(translations);
    purgeSyntaxData(syntaxData);
    /** @type {ReadonlyArray<string>[]} */
    const tagNameSlot = expandPresetData(rawPreset, translations, syntaxData, synonymsMap);
    return {
        /**
         * provide marker tags
         */
        marker: rawPreset.marker,
        /**
         * provide simple tags
         */
        simple: rawPreset.simple,
        /**
         * provide complexity tags
         */
        complexity: rawPreset.complexity,
        /**
         * @param {true} [isBlock]
         * @returns {ReadonlyArray<JSDocTagPresetAPI.TJSDocTagPresetEntry>}
         */
        entries(isBlock) {
            /** @type {ReadonlyArray<JSDocTagPresetAPI.TJSDocTagPresetEntry>} */
            let entries = entriesSlot[+(!isBlock)];
            if (!entries) {
                entriesSlot[+(!isBlock)] = entries = createPresetEntries(tagNameSlot[+(!isBlock)], translations, syntaxData, synonymsMap, isBlock);
                Object.freeze(entries);
            }
            return entries;
        },
        /**
         * @param {true} [isBlock]
         */
        tagNames(isBlock) {
            return tagNameSlot[+(!isBlock)];
        },
        /**
         * @param {string} tagName
         * @param {true} [isBlock]
         * @returns {string}
         */
        getExtraInfo(tagName, isBlock) {
            return rawPreset.getExtraInfo(tagName, isBlock);
        },
        dispose() {
        }
    };
}
/**
 * `TJSDocTagRawPreset` instance, create factory function from related preset data
 *
 * @param {JSDocTagPresetAPI.TJSDocTagRawPreset} rawPreset TJSDocTagRawPreset instance, One instance will be sufficient for this instance, resulting in a singleton
 * @param {JSDocTagPresetAPI.TTranslationsMap} translations translation map data
 * @param {JSDocTagPresetAPI.TSyntaxMap} syntaxes syntanx map data
 * @returns {JSDocTagPresetAPI.IJSDocTagPresetFactory}
 * @date 2020/9/5
 */
const compose = (rawPreset, translations, syntaxes) => () => injectDependencies(rawPreset, translations, syntaxes);
module.exports = compose;