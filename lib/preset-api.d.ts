/*!
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  Copyright (C) 2020 jeffy-g <hirotom1107@gmail.com>
  Released under the MIT license
  https://opensource.org/licenses/mit-license.php
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
*/
import * as ts from "typescript/lib/tsserverlibrary";
/**
 * locale syntax conforms to the typescript locale tokens
 * 
 * @date 2020/6/3
 * @version 1.0
 */
type TPresetLocaleTokens =
    | "en"
    | "cs"
    | "de"
    | "es"
    | "fr"
    | "it"
    | "ja"
    | "ko"
    | "pl"
    | "pt-br"
    | "ru"
    | "tr"
    | "zh-cn"
    | "zh-tw";
/**
 * @date 2020/8/31
 */
type TTagKindToken = "block" | "inline";
type TTranslationMap = Record<"blockDocs" | "inlineDocs", ts.MapLike<string>>;
type TTranslationsMap = Record<TPresetLocaleTokens, TTranslationMap>;
type TSyntaxMap = Record<TTagKindToken, ts.MapLike<string>>;
/**
 * @date 2020/8/29
 */
type TSynonymsMap = {
    [token in TTagKindToken]: ts.MapLike<string[]>;
};
/**
 * @date 2020/5/26
 * @version 1.0
 */
type TJSDocTagPresetEntry = {
    /**
     * JSDoc tag name such as abstract, access, param ...
     */
    readonly name: string;
    /**
     * synonyms of `name` property
     */
    readonly synonyms?: string[];
    /**
     * syntax string for `name`
     * 
     * e.g - "&#64;param [{&lt;type>}] &lt;name> &lt;description>"
     */
    readonly syntax?: string;
    /**
     * documentation of `name` property if presents
     * @default "en"
     */
    document(locale?: TPresetLocaleTokens): string | undefined;
}
/**
 * @date 2020/8/30
 * @version 2.0 remove generics
 */
type TJSDocTagPresetRaw = {
    /**
     * provide marker tags
     */
    marker: string | string[];
    /**
     * provide simple tags
     */
    simple: string | string[];
    /**
     * provide complexity tags
     */
    complexity: string | string[];
    /**
     * acquire available jsdoc tag names
     * 
     * @param isBlock `true` if need block type, when inline should pass `undefined`(or omit paramter) not `false`.
     */
    tagNames(isBlock?: true): string[];
    /**
     * Returns the string if there is information, or an empty string otherwise
     * 
     * @param tagName
     * @param isBlock
     * @date 2020/9/5
     */
    getExtraInfo(tagName: string, isBlock?: true): string;
};
/**
 * @interface
 * @date 2020/8/30
 * @version 1.0
 */
interface IJSDocTagPresetProvider extends TJSDocTagPresetRaw {
    /**
     * acquire available jsdoc tag preset entries
     * 
     * @param isBlock `true` if need block type, when inline should pass `undefined`(or omit paramter) not `false`.
     */
    entries(isBlock?: true): TJSDocTagPresetEntry[];
    /**
     * If need cleanup, do it during this method call
     * 
     * @todo this method is experimental
     */
    dispose(): void;
}
/**
 * Entry signature of Preset module
 * 
 * @date 2020/8/30
 */
interface IJSDocTagPresetFactory {
    (): IJSDocTagPresetProvider;
}
/**
 * @date 2020/9/11
 */
interface IPresetFactoryComposer {
    (presetRaw: TJSDocTagPresetRaw, translations: TTranslationsMap, syntaxes: TSyntaxMap): IJSDocTagPresetFactory;
}
export as namespace JSDocTagPresetAPI;