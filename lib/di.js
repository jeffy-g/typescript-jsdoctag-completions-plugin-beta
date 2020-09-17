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
 * @template T
 * @typedef {{ -readonly [P in keyof T]: T[P]; }} XReadonly
 */
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
/**
 * purge object prototype
 *
 * @param {JSDocTagPresetAPI.TTranslationsMap} translations
 */
function purgeTranslationData(translations) {
    /** @type {JSDocTagPresetAPI.TPresetLocaleTokens[]} */
    const locales = (Object.keys(translations));
    for (let i = 0, end = locales.length; i < end;) {
        const locale = locales[i++];
        /** @type {JSDocTagPresetAPI.TTranslationMap} */
        const entry = translations[locale];
        /** @type {JSDocTagPresetAPI.TTranslationMap} */
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
 * @param {string[]} names
 * @param {JSDocTagPresetAPI.TTranslationsMap} translations
 * @param {JSDocTagPresetAPI.TSyntaxMap} syntaxMap
 * @param {JSDocTagPresetAPI.TSynonymsMap} synonymsMap synonyms cache object
 * @param {true} [isBlock]
 * @returns {void}
 * @version 2.0
 */
function expandPresetData(names, translations, syntaxMap, synonymsMap, isBlock) {
    const tagKindToken = isBlock ? "block" : "inline";
    /** @type {keyof JSDocTagPresetAPI.TTranslationMap} */
    const kindToken4Translation = (tagKindToken + "Docs");
    const syntaxes = syntaxMap[tagKindToken];
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
}
/**
 * @param {string[]} nameData
 * @param {JSDocTagPresetAPI.TTranslationsMap} translations
 * @param {JSDocTagPresetAPI.TSyntaxMap} syntaxMap
 * @param {JSDocTagPresetAPI.TSynonymsMap} synonymsMap
 * @param {true} [isBlock]
 * @returns {JSDocTagPresetAPI.TJSDocTagPresetEntry[]}
 */
function createPresetEntries(nameData, translations, syntaxMap, synonymsMap, isBlock) {
    /** @type {JSDocTagPresetAPI.TJSDocTagPresetEntry[]} */
    const entries = [];
    const tagKindToken = isBlock ? "block" : "inline";
    /** @type {keyof JSDocTagPresetAPI.TTranslationMap} */
    const kindToken4Translation = (tagKindToken + "Docs");
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
        /** @type {XReadonly<JSDocTagPresetAPI.TJSDocTagPresetEntry>} */
        const nullobj = Object.create(null);
        nullobj.name = name;
        nullobj.synonyms = symMap[name];
        nullobj.syntax = syntaxes[name];
        nullobj.document = document;
        entries[index++] = nullobj;
    }
    return entries;
}
/**
 * Hide the implementation of Preset interface by javascript's Closure
 *
 *  + The preset instance constructed by this function should be used as a cache
 *
 * @param {JSDocTagPresetAPI.TJSDocTagPresetRaw} presetRaw must be singleton instance
 * @param {JSDocTagPresetAPI.TTranslationsMap} translations
 * @param {JSDocTagPresetAPI.TSyntaxMap} syntaxData
 * @returns {JSDocTagPresetAPI.IJSDocTagPresetProvider}
 */
function injectDependencies(presetRaw, translations, syntaxData) {
    /** @type {JSDocTagPresetAPI.TJSDocTagPresetEntry[][]} */
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
    expandPresetData(presetRaw.tagNames(true), translations, syntaxData, synonymsMap, true);
    expandPresetData(presetRaw.tagNames(), translations, syntaxData, synonymsMap);
    return {
        /**
         * provide marker tags
         */
        marker: presetRaw.marker,
        /**
         * provide simple tags
         */
        simple: presetRaw.simple,
        /**
         * provide complexity tags
         */
        complexity: presetRaw.complexity,
        /**
         * @param {true} [isBlock]
         * @returns {JSDocTagPresetAPI.TJSDocTagPresetEntry[]}
         */
        entries(isBlock) {
            /** @type {JSDocTagPresetAPI.TJSDocTagPresetEntry[]} */
            let entries = entriesSlot[+(!isBlock)];
            if (!entries) {
                entriesSlot[+(!isBlock)] = entries = createPresetEntries(presetRaw.tagNames(isBlock), translations, syntaxData, synonymsMap, isBlock);
            }
            return entries;
        },
        /**
         * @param {true} [isBlock]
         */
        tagNames(isBlock) {
            return presetRaw.tagNames(isBlock);
        },
        /**
         * @param {string} tagName
         * @param {true} [isBlock]
         * @returns {string}
         */
        getExtraInfo(tagName, isBlock) {
            return presetRaw.getExtraInfo(tagName, isBlock);
        },
        dispose() {
        }
    };
}
/**
 * `TJSDocTagPresetRaw` instance, create factory function from related preset data
 *
 * @param {JSDocTagPresetAPI.TJSDocTagPresetRaw} presetRaw TJSDocTagPresetRaw instance, One instance will be sufficient for this instance, resulting in a singleton
 * @param {JSDocTagPresetAPI.TTranslationsMap} translations translation map data
 * @param {JSDocTagPresetAPI.TSyntaxMap} syntaxes syntanx map data
 * @returns {JSDocTagPresetAPI.IJSDocTagPresetFactory}
 * @date 2020/9/5
 */
const compose = (presetRaw, translations, syntaxes) => {
    /**
     * @type {JSDocTagPresetAPI.IJSDocTagPresetFactory}
     * @returns {JSDocTagPresetAPI.IJSDocTagPresetProvider}
     */
    return () => {
        return injectDependencies(presetRaw, translations, syntaxes);
    };
};
module.exports = compose;