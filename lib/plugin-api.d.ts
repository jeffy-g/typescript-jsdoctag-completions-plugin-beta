/*!
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  Copyright (C) 2020 jeffy-g <hirotom1107@gmail.com>
  Released under the MIT license
  https://opensource.org/licenses/mit-license.php
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
*/
/// <reference path="./preset-api.d.ts"/>
import * as ts from "typescript/lib/tsserverlibrary";
/**
 * @date 2020/6/5
 */
type TJSDocTagCompletionsPluginConfig = {
    /**
     * This means the plugin config is the value defined on workspace settings in vscode.
     * 
     * CAUTION: This value must not be set when config defined in tsconfig.json@compilerOptions/plugins!
     * 
     * @date 2020/10/16
     */
    global?: true;
    /**
     * This means the plugin config is the value defined on workspace settings in vscode.
     * 
     * CAUTION: This value must not be set when config defined in tsconfig.json@compilerOptions/plugins!
     * 
     * @date 2020/9/5
     */
    vscode?: true;
    /**
     * Specify the jsdoc tag preset.
     * 
     *   + `default` and [closure](https://github.com/google/closure-compiler/wiki) are implemented as builtin presets
     * 
     *   + 🖌️ If you have your own defined preset, value its module id
     * 
     * use `default` when omitted.
     * 
     * @default "default"
     */
    preset?: "default" | "closure" | string;
    /**
     * Use if you need to set a locale that takes precedence over the native OS locale
     * 
     * Can specify other locales to force the use of locales.  
     * If omitted, the project locale and system locale are applied in that order.
     */
    locale?: JSDocTagPresetAPI.TPresetLocaleTokens;
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
 * @date 2020/8/30
 */
interface IJSDocTagCompletionService {
    /**
     * @date 2020/8/31
     */
    locale: JSDocTagPresetAPI.TPresetLocaleTokens;
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
     * means run on vscode extension
     * @date 2020/10/17
     */
    vscode?: true;
    /**
     * @date 2020/10/17
     */
    notifyToVscodeExtension(): void;
    /**
     * #### apply plugin config
     * 
     * @param {ts.server.Project} project need a reference to the `ts.server.Project` because need to get the details of `tsconfig.json` by method `getCompilerOptions`
     * @param {TJSDocTagCompletionsPluginConfig} config It may be a complete plugin config or a fragmented config.  
     *     This could be the one set in tsconfig.json or the config transferred from the vscode extension
     * @param {JSDocTagPresetAPI.TPresetLocaleTokens} [preferredLocale] Will be used if tsconfig.json does not have a locale set,  
     *     or the config forwarded by the vscode extension does not have a locale set.  
     *     default is `undefined`. (which means use native locale
     */
    update(
        project: ts.server.Project,
        config: TJSDocTagCompletionsPluginConfig,
        preferredLocale?: JSDocTagPresetAPI.TPresetLocaleTokens
    ): void;
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
 * @internal
 */
declare const enum EPluginMode {
    StandAlone,
    Global
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
type TJSDocRuntimeCache = {
    getJSDocTagNameCompletions: () => ts.CompletionEntry[];
    getInlineJSDocTagNameCompletions: () => ts.CompletionEntry[];
    getJSDocTagCompletions: () => ts.CompletionEntry[];
    getInlineJSDocTagCompletions: () => ts.CompletionEntry[];
};
export as namespace P;