/// <reference path="./plugin-api.d.ts"/>
"use strict";
/*!
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  Copyright (C) 2020 jeffy-g <hirotom1107@gmail.com>
  Released under the MIT license
  https://opensource.org/licenses/mit-license.php
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
/**
 * @typedef {import("typescript").server.Logger} tsServerLogger
 */
/**
 * plugin logger (config.verbose
 * @type {TBD<tsServerLogger>}
 */
let logger;
/** @type {P.ITsServerLoggerUser} */
const PluginLogger = {
    /**
     * @param {string} text
     */
    log(text) {
        // @ts-expect-error `DEBUG` is not ts.server.Msg type
        logger && logger.msg(text, "DEBUG");
    },
    /** @type {(logger?: tsServerLogger) => void} */
    setLogger(tslogger) {
        console.log(`TsServerLoggerUser on ${process.cwd()}`);
        logger = tslogger || void 0;
    },
    /**
     * @date 2022/2/19 18:26:32
     */
    get isAvailable() {
        return !!(logger && typeof logger === "object" && typeof logger.msg === "function");
    }
};
exports.logger = PluginLogger;