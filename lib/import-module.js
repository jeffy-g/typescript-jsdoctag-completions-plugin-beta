"use strict";
/*!
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  Copyright (C) 2020 jeffy-g <hirotom1107@gmail.com>
  Released under the MIT license
  https://opensource.org/licenses/mit-license.php
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
*/
/**
 * This module allows to load an external preset module in webpack build
 *
 * @param {string} presetPath builtin preset name or preset interface implemented module path
 * @type {<T>(presetPath: string) => Promise<T>}
 * @date 2020/9/11
 */
const loadPreset = (presetPath) => Promise.resolve(`${presetPath}`).then(s => require(s));
module.exports = loadPreset;