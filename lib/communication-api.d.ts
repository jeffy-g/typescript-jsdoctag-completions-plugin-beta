/*!
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  Copyright (C) 2020 jeffy-g <hirotom1107@gmail.com>
  Released under the MIT license
  https://opensource.org/licenses/mit-license.php
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
*/
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
     * 
     */
    closed?: true;
};
/**
 * 
 */
declare const enum ECommunicationConstant {
    HOST = "127.0.0.1",
    PORT = 55555
}
declare interface ICommunicationServerLogger {
    log(text: string): void;
}