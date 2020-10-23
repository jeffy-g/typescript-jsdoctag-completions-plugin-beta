/*!
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  Copyright (C) 2020 jeffy-g <hirotom1107@gmail.com>
  Released under the MIT license
  https://opensource.org/licenses/mit-license.php
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
*/
import * as ts from "typescript/lib/tsserverlibrary";
declare global {
    /**
     * Remove readonly
     */
    type Writable<T> = {
        -readonly [P in keyof T]: T[P];
    };
    /**
     * pick properties by exclude list
     */
    type ExcludePick<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
}
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
};
/**
 * ### About `marker`, `simple`, `complexity` property
 * 
 *   + `marker` - As the name implies
 * 
 *   + `simple` - A jsdoc tag that only allows `descriptions` (and inline tag
 *
 *     * Cannot contain type annotations
 * 
 *   + `complexity` - A jsdoc tag that allows `type annotations` and "descriptions"
 * 
 * 
 * @todo Some tags don't apply to above. e.g - &#64;access public
 * 
 * 
 * #### The values of these properties are used as the list data for the regex
 * 
 *   + For regex fragments
 * 
 *   ```js
 *   // e.g
 *   "see|deprecated|classdesc|copyright|todo|fileoverview|summary|file|desc(?:ription)?|overview"
 *   ```
 * 
 *   + If simply defined as `string[]`, the result of `array.join("|")` will be used as the regex.
 * 
 * @date 2020/8/30
 * @version 2.0 remove generics
 */
type TJSDocTagRawPreset = {
    /**
     * provide marker tags
     */
    readonly marker: string | string[];
    /**
     * provide simple tags
     */
    readonly simple: string | string[];
    /**
     * provide complexity tags
     */
    readonly complexity: string | string[];
    /**
     * Returns the string if there is information, or an empty string otherwise
     * 
     * @param tagName
     * @param isBlock
     * @date 2020/9/5
     */
    getExtraInfo(tagName: string, isBlock?: true): string;
    /**
     * ### Provides jsdoc tag name data, which is the cornerstone of preset.
     * 
     * tag name data syntax:
     * 
     * ```js
     * // block type
     * const blockNames = [
     *     "function:func,method",
     *     "<base name>[:<synonym>[,<synonym>]]",
     *     // ...
     * ];
     * ```
     * 
     * @param isBlock `true` if need block type, when inline should pass `undefined`(or omit paramter) not `false`.
     */
    provideTagData(isBlock?: true): string[];
};
/**
 * @interface
 * @date 2020/8/30
 * @version 1.0
 */
interface IJSDocTagPresetProvider extends ExcludePick<TJSDocTagRawPreset, "provideTagData"> {
    /**
     * acquire available jsdoc tag names
     * 
     * @param isBlock `true` if need block type, when inline should pass `undefined`(or omit paramter) not `false`.
     */
    tagNames(isBlock?: true): ReadonlyArray<string>;
    /**
     * acquire available jsdoc tag preset entries
     * 
     * @param isBlock `true` if need block type, when inline should pass `undefined`(or omit paramter) not `false`.
     */
    entries(isBlock?: true): ReadonlyArray<TJSDocTagPresetEntry>;
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
    (rawPreset: TJSDocTagRawPreset, translations: TTranslationsMap, syntaxes: TSyntaxMap): IJSDocTagPresetFactory;
}
export as namespace JSDocTagPresetAPI;