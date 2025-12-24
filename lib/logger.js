"use strict";
/*!
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  Copyright (C) 2020 jeffy-g <hirotom1107@gmail.com>
  Released under the MIT license
  https://opensource.org/licenses/mit-license.php
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
*/
/// <reference path="./plugin-api.d.ts"/>
/**
 * @typedef {import("typescript").server.Logger} tsServerLogger
 */
/**
 * plugin logger (config.verbose
 * @type {tsServerLogger | undefined}
 */
let logger;
/** @type {P.ITsServerLoggerUser} */
const PluginLogger = {
    /**
     * @param {string} text
     */
    log(text) {
        // @ts-expect-error 
        logger && logger.msg(text, "DEBUG");
    },
    setLogger(tslogger) {
        logger = tslogger || void 0;
    },
    /**
     * @date 2022/2/19 18:26:32
     */
    get isAvailable() {
        return !!(logger && typeof logger === "object" && typeof logger.info === "function");
    }
};
module.exports = PluginLogger;