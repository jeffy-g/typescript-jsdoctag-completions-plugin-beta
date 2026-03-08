/// <reference path="./preset-api.d.ts"/>
"use strict";
/*!
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  Copyright (C) 2020 jeffy-g <hirotom1107@gmail.com>
  Released under the MIT license
  https://opensource.org/licenses/mit-license.php
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.compose = void 0;
exports.categolizeTagType = categolizeTagType;
/**
 * @file jsdoc tag preset composer
 * @author jeffy-g <hirotom1107@gmail.com>
 * @version 4.1
 */
const logger_1 = require("./logger");
/** @type {<T = Record<string, any>>() => T} */
const nullobj = () => Object.create(null);
function categolizeTagType() {
}
/**
 * Remove the built-in object prototype
 *
 * @template {Record<string, string>} M
 * @param {M} map
 * @returns {M}
 */
function eliminateCopy(map) {
    /** @type {M} */
    const copy = nullobj();
    for (let index = 0, keys = Object.keys(map), end = keys.length; index < end;) {
        const key = keys[index++];
        copy[key] = map[key];
    }
    return copy;
}
/**
 * The purge subject source map is copied to a **null prototype object** via Object.create(null).
 *
 * @template {string} S
 * @param {JSDocTagPresetAPI.TPurgeSubjectStource<S>} map
 * @param {S=} suffix
 * @param {boolean=} overwrite
 * @since 4.2.16-dev
 */
function purgeBuiltInProto(map, suffix, overwrite = false) {
    const copy = /** @type {JSDocTagPresetAPI.TPurgeSubjectStource<S>} */ (overwrite ? map : {});
    suffix ??= /** @type {S} */ ("");
    copy[`block${suffix}`] = eliminateCopy(map[`block${suffix}`]);
    copy[`inline${suffix}`] = eliminateCopy(map[`inline${suffix}`]);
    return copy;
}
/* eslint-disable @tseslintPlugin/array-type */
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
        translations[locale] = purgeBuiltInProto(entry, "Docs");
    }
}
/**
 * purge object prototype
 *
 * @param {JSDocTagPresetAPI.TSyntaxMap} data
 */
function purgeSyntaxData(data) {
    purgeBuiltInProto(data, "", true);
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
    return syntax.replace((/<([\w\s|=?]+)>/g), ($0, $1) => {
        if ($1 && $1.indexOf("|") !== -1) {
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
 * @param {JSDocTagPresetAPI.TPresetDataMap=} jsdocSnippetMap
 * @param {true} [isBlock]
 * @returns {JSDocTagPresetAPI.TJSDocTagPresetEntry[]}
 * @see above {@linkplain toSnippet}
 * @date 2022/3/1 support snippet feature!
 */
function createPresetEntries(nameData, translations, syntaxMap, synonymsMap, jsdocSnippetMap, isBlock) {
    /** @type {JSDocTagPresetAPI.TJSDocTagPresetEntry[]} */
    const entries = [];
    const tagKindToken = isBlock ? "block" : "inline";
    const kindToken4Translation =
    /** @type {keyof JSDocTagPresetAPI.TTranslationMap} */ (tagKindToken + "Docs");
    const syntaxes = syntaxMap[tagKindToken];
    const symMap = synonymsMap[tagKindToken];
    logger_1.logger.log(`createPresetEntries:debugDump, synonymsMap=[${JSON.stringify(symMap, null, 2)}]`);
    /**
     * @type {function(this: JSDocTagPresetAPI.TJSDocTagPresetEntry, JSDocTagPresetAPI.TPresetLocaleTokens): TBD<string>}
     */
    const document = function (locale = "en") {
        const _name = this.name;
        logger_1.logger.log(`JSDocTagPresetEntry.document, tagName=${_name} locale=[${locale}]`);
        const tr = translations[locale] || translations["en"];
        if (tr) {
            const section = tr[kindToken4Translation];
            const doc = section[_name] || translations["en"][kindToken4Translation][_name];
            const jsdocSnippet = (jsdocSnippetMap ? jsdocSnippetMap[tagKindToken][_name] : "") ?? "";
            if (jsdocSnippet) {
                return `${doc}\n\`\`\`js${jsdocSnippet}\`\`\``;
            }
            return doc;
        }
    };
    for (let index = 0, end = nameData.length; index < end;) {
        const name = nameData[index];
        const nullObject =
        /** @type {Writable<JSDocTagPresetAPI.TJSDocTagPresetEntry>} */ (nullobj());
        nullObject.name = name;
        nullObject.synonyms = symMap[name];
        const syntax = syntaxes[name];
        if (typeof syntax === "string") {
            let snippet = toSnippet(syntax);
            if (!isBlock) {
                snippet = snippet.slice(1, snippet.length - 1);
            }
            nullObject.snippet = snippet;
            nullObject.syntax = syntax;
        }
        nullObject.document = document;
        entries[index++] = Object.freeze(nullObject);
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
 * @param {JSDocTagPresetAPI.TPresetDataMap=} jsdocSnippetMap
 * @returns {JSDocTagPresetAPI.IJSDocTagPresetProvider}
 */
function injectDependencies(rawPreset, translations, syntaxData, jsdocSnippetMap) {
    /** @type {ReadonlyArray<JSDocTagPresetAPI.TJSDocTagPresetEntry>[]} */
    let entriesSlot = [];
    /**
     * @type {JSDocTagPresetAPI.TSynonymsMap}
     */
    const synonymsMap = {
        block: nullobj(),
        inline: nullobj()
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
                entriesSlot[+(!isBlock)] = entries = createPresetEntries(tagNameSlot[+(!isBlock)], translations, syntaxData, synonymsMap, jsdocSnippetMap, isBlock);
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
        /**
         * @param {string} tagName
         * @returns {string}
         * @date 2026/1/9
         */
        getTagTypeInfo(tagName) {
            return rawPreset.getTagTypeInfo(tagName);
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
 * @param {JSDocTagPresetAPI.TPresetDataMap=} jsdocSnippetMap
 * @returns {JSDocTagPresetAPI.IJSDocTagPresetFactory}
 * @date 2020/9/5
 */
const compose = (rawPreset, translations, syntaxes, jsdocSnippetMap) => () => injectDependencies(rawPreset, translations, syntaxes, jsdocSnippetMap);
exports.compose = compose;