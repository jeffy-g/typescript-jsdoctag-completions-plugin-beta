/*!
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  Copyright (C) 2020 jeffy-g <hirotom1107@gmail.com>
  Released under the MIT license
  https://opensource.org/licenses/mit-license.php
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
*/
/// <reference path="./preset-api.d.ts"/>
import * as ts from "typescript";
/**
 * Configuration for the JSDoc Tag Completions Plugin.
 * 
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
 * Information required to create the JSDoc Tag Completions Plugin.
 * 
 * @date 2020/6/26
 */
interface IJSDocTagCompletionsPluginCreateInfo extends ts.server.PluginCreateInfo {
    config: TJSDocTagCompletionsPluginConfig;
}
/**
 * Service for JSDoc Tag Completions.
 * 
 * @date 2020/8/30
 */
interface IJSDocTagCompletionService {
    /**
     * Locale token for the JSDoc Tag Preset.
     * 
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
     * Indicates if the plugin is running on a VSCode extension.
     * 
     * @date 2020/10/17
     */
    vscode?: true;
    /**
     * Notify the VSCode extension.
     * 
     * @date 2020/10/17
     */
    notifyToVscodeExtension(): void;
    /**
     * Apply plugin configuration.
     * 
     * @param {ts.server.Project} project Reference to the `ts.server.Project` to get details of `tsconfig.json` using `getCompilerOptions`.
     * @param {TJSDocTagCompletionsPluginConfig} config Complete or fragmented plugin configuration.
     * @param {JSDocTagPresetAPI.TPresetLocaleTokens} [preferredLocale] Used if `tsconfig.json` or VSCode extension config does not have a locale set. Defaults to `undefined` (uses native locale).
     */
    update(
        project: ts.server.Project,
        config: TJSDocTagCompletionsPluginConfig,
        preferredLocale?: JSDocTagPresetAPI.TPresetLocaleTokens
    ): void;
    /**
     * Returns a `ts.LanguageService` instance.
     */
    getService(): ts.LanguageService;
    /**
     * Set the preset module.
     * 
     * @param {string} [modulePathOrName] `default` or `closure` for builtin presets, or the module id of the preset module.
     */
    setPreset(modulePathOrName?: string): void;
    /**
     * Current preset module.
     * 
     * @date 2022/2/27
     */
    readonly currentPreset: string;
}
/**
 * Interface for using the TypeScript server logger.
 * 
 * @date 2020/9/11
 */
interface ITsServerLoggerUser {
    /**
     * Enable or disable logging with the provided `logger`.
     * 
     * @param {ts.server.Logger} [logger] Disable logging if `logger` is undefined.
     */
    setLogger(logger?: ts.server.Logger): void;
    /**
     * Log a text string to the tsserver log.
     * 
     * @param text Text to log.
     */
    log(text: string): void;
    /**
     * Indicates if a valid logger is set.
     */
    isAvailable: boolean;
}
export as namespace P;