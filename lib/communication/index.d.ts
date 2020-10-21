/*!
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  Copyright (C) 2020 jeffy-g <hirotom1107@gmail.com>
  Released under the MIT license
  https://opensource.org/licenses/mit-license.php
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
*/
/// <reference path="../communication-api.d.ts"/>
export declare const launchMessageServer: <T extends TJSDocTagCompionsPluginMessage>(ondata: (message: T) => void, logger?: ICommunicationServerLogger) => void;
export declare const sendMessage: <T extends TJSDocTagCompionsPluginMessage>(message: T) => void;