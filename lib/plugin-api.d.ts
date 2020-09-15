import * as ts from "typescript/lib/tsserverlibrary";
/**
 * @date 2020/6/5
 */
type TJSDocTagCompletionsPluginConfig = {
    /**
     * Specify the jsdoc tag preset.
     * use "default" when omitted.
     * @default "default"
     */
    preset?: "default" | "closure" | string;
    /**
     * Use if you need to set a locale that takes precedence over the native OS locale
     * 
     * Can specify other locales to force the use of locales.  
     * If omitted, the project locale and system locale are applied in that order.
     */
    locale?: TPresetLocaleTokens;
    /**
     * Whether to log info level in tsserver log.
     */
    verbose?: boolean;
    /**
     * @deprecated this option is debug use (in beta version
     */
    betaMark?: string;
};
/**
 * @date 2020/6/26
 */
interface IJSDocTagCompletionsPluginCreateInfo extends ts.server.PluginCreateInfo {
    config: TJSDocTagCompletionsPluginConfig;
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
    synonyms?: string[];
    /**
     * documentation of `name` property if presents
     * @default "en"
     */
    document(locale?: TPresetLocaleTokens): string | undefined;
    /**
     * syntax string for `name`
     * 
     * e.g - "&#64;param [{&lt;type>}] &lt;name> &lt;description>"
     */
    syntax?: string;
}
/**
 * @date 2020/8/31
 */
type TTagKindToken = "block" | "inline";
/**
 * @date 2020/8/29
 */
type TStringMap<T> = Record<string, T>;
type TTranslationMap = Record<"blockDocs" | "inlineDocs", TStringMap<string>>;
type TTranslationsMap = Record<TPresetLocaleTokens, TTranslationMap>;
type TSyntaxMap = Record<TTagKindToken, TStringMap<string>>;
/**
 * @date 2020/8/29
 */
type TSynonymsMap = {
    [token in TTagKindToken]: TStringMap<string[]>;
};
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
 * @date 2020/8/30
 */
interface IJSDocTagCompletionService {
    /**
     * @date 2020/8/31
     */
    locale: TPresetLocaleTokens;
    /**
     * This value will be true if `locale` is set in the project's `compilerOptions`.
     * 
     * otherwise, this setting is will be `undefined`
     * 
     * ```jsonc
     * // (ts|js)config.json
     * {
     *   "compilerOptions": {
     *     "locale": "en" // English
     * //   ^^^^^^^^^^^^^^
     *   }
     * }
     * 
     * ```
     * 
     * @date 2020/8/26
     */
    projectHasLocale?: true;
    /**
     * This value will be `true` if the plugin config  is set to  `@compilerOptions/plugins` and a valid` preset` is set.
     * 
     * otherwise, this setting is will be `undefined`
     * 
     * ```jsonc
     * // tsconfig.json
     * {
     *   "compilerOptions": {
     *     "target": "es2019",
     *     "module": "commonjs",
     *     "strict": true,
     *     "locale": "ja",
     *     "baseUrl": "./",
     *     "outDir": "./lib",
     *     "plugins": [
     *       {
     *         "name": "typescript-jsdoctag-completions-plugin",
     *         "verbose": true,
     *         "preset": "closure" // "closure" is builtin preset
     * //       ^^^^^^^^^^^^^^^^^^
     *       }
     *     ]
     *   }
     * }
     * ```
     * @date 2020/9/4
     */
    projectHasPreset?: true;
    /**
     * #### apply plugin config
     * 
     * @param {ts.server.Project} project need a reference to the `ts.server.Project` because need to get the details of `tsconfig.json` by method `getCompilerOptions`
     * @param {N.TJSDocTagCompletionsPluginConfig} config It may be a complete plugin config or a fragmented config.  
     *     This could be the one set in tsconfig.json or the config transferred from the vscode extension
     * @param {N.TPresetLocaleTokens} [preferredLocale] Will be used if tsconfig.json does not have a locale set,  
     *     or the config forwarded by the vscode extension does not have a locale set.  
     *     default is `undefined`. (which means use native locale
     */
    update(
        project: ts.server.Project,
        config: N.TJSDocTagCompletionsPluginConfig,
        preferredLocale?: N.TPresetLocaleTokens
    ): void
    /**
     * returns a `ts.LanguageService` instance
     */
    getService(): ts.LanguageService;
    /**
     * @param {string} [modulePathOrName] This string should be `default` or `closure` for builtin preset, or the module id of the preset module.
     */
    setPreset(modulePathOrName?: string): void;
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
interface ITsServerLoggerUser {
    /**
     * Control enable/disable of logging with `logger` parameter
     * 
     * @param {ts.server.Logger} [logger] will be disable logging when `logger` parameter is undefined
     */
    setLogger(logger?: ts.server.Logger): void;
    log(text: string): void;
}
/**
 * @date 2020/9/11
 */
interface IPresetFactoryComposer {
    (presetRaw: TJSDocTagPresetRaw, translations: TTranslationsMap, syntaxes: TSyntaxMap): IJSDocTagPresetFactory;
}
type TJSDocRuntimeCache = {
    getJSDocTagNameCompletions: () => ts.CompletionEntry[];
    getInlineJSDocTagNameCompletions: () => ts.CompletionEntry[];
    getJSDocTagCompletions: () => ts.CompletionEntry[];
    getInlineJSDocTagCompletions: () => ts.CompletionEntry[];
};
export as namespace N;