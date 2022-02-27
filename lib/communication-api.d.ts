/*!
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  Copyright (C) 2020 jeffy-g <hirotom1107@gmail.com>
  Released under the MIT license
  https://opensource.org/licenses/mit-license.php
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
*/
/// <reference path="./preset-api.d.ts"/>
/**
 * 
 */
type TJSDocTagCompionsPluginMessage = {
    /**
     * 
     */
    projectName: string;
    /**
     * 
     */
    timeStamp: number;
    /**
     * 
     */
    reload: number;
    /**
     * @date 2022/2/27
     */
    locale: JSDocTagPresetAPI.TPresetLocaleTokens;
    /**
     * 
     */
    closed?: true;
};
/**
 * @enum {string | number}
 */
declare const enum ECommunicationConstant {
    HOST = "127.0.0.1",
    PORT = 55555
}
declare interface ICommunicationServerLogger {
    log(text: string): void;
}