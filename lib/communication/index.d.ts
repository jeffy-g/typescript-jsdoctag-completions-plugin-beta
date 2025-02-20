/*!
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  Copyright (C) 2020 jeffy-g <hirotom1107@gmail.com>
  Released under the MIT license
  https://opensource.org/licenses/mit-license.php
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
*/
/// <reference path="../communication-api.d.ts"/>
/**
 * Starts a server to notify about project update events.
 * 
 * __CAUTION: DO NOT USE ON CLIENT SIDE!__
 * 
 * @internal
 * @date 2023-10-17
 */
export declare const launchMessageServer: () => void;
/**
 * Notifies listeners that the project has been updated.
 * 
 * __CAUTION: DO NOT USE ON CLIENT SIDE!__
 * 
 * @internal
 * @date 2023-10-17
 */
export declare const fireProjectUpdateEvent: <T extends TJSDocTagCompionsPluginMessage>(message: T) => void;
/**
 * The client side connects to the plugin server and subscribes to project updates.
 * 
 * @date 2023-10-17
 */
export declare const subscribeProjectEvent: <T extends TJSDocTagCompionsPluginMessage>(ondata: (message: T) => void, logger?: ICommunicationClientLogger) => void;