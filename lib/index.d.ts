/*!
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  Copyright (C) 2020 jeffy-g <hirotom1107@gmail.com>
  Released under the MIT license
  https://opensource.org/licenses/mit-license.php
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
*/
/*!
 * For license information please see licenses.txt
 */
import * as ts from "typescript";
type TPluginModuleFactoryWithVersion = ts.server.PluginModuleFactory & {
    readonly version: string;
};
declare const factory: TPluginModuleFactoryWithVersion;
export = factory;