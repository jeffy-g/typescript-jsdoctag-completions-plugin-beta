/*!
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  Copyright (C) 2020 jeffy-g <hirotom1107@gmail.com>
  Released under the MIT license
  https://opensource.org/licenses/mit-license.php
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
*/
/// <reference path="./plugin-api.d.ts"/>
/**
 * @typedef {import("typescript/lib/tsserverlibrary")} ts
 */
/**
 * plugin logger (config.verbose
 * @type {ts.server.Logger | undefined}
 */
let logger;
/** @type {P.ITsServerLoggerUser} */
const PluginLogger = {
    /**
     * @param {string} text
     */
    log(text) {
        logger && logger.info(text);
    },
    setLogger(tslogger) {
        logger = tslogger;
    }
};
module.exports = PluginLogger;