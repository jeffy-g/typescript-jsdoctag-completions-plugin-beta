/*!
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  Copyright (C) 2020 jeffy-g <hirotom1107@gmail.com>
  Released under the MIT license
  https://opensource.org/licenses/mit-license.php
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
*/
/// <reference path="./preset-api.d.ts"/>
/**
 * Represents a message for the JSDoc Tag Completions Plugin.
 */
type TJSDocTagCompionsPluginMessage = {
  /**
   * The name of the project.
   */
  projectName: string;
  /**
   * The timestamp of the message.
   */
  timeStamp: number;
  /**
   * The reload count.
   */
  reload: number;
  /**
   * The locale token.
   * @date 2022/2/27
   */
  locale: JSDocTagPresetAPI.TPresetLocaleTokens;
  /**
   * Indicates if the message is closed.
   */
  closed?: true;
};
/**
 * Communication constants used in the plugin.
 * @enum {string | number}
 */
declare const enum ECommunicationConstant {
  HOST = "127.0.0.1",
  PORT = 51234
}
/**
 * Interface for the communication client logger.
 */
declare interface ICommunicationClientLogger {
  /**
   * Logs a message.
   * @param {string} text - The text to log.
   */
  log(text: string): void;
}