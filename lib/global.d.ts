/*!
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//  Copyright (C) 2018 jeffy-g <hirotom1107@gmail.com>
//  Released under the MIT license
//  https://opensource.org/licenses/mit-license.php
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
*/
/**
 * @file src/global.d.ts
 * @history rename from basic-types.d.ts
 */
/**
 * #### To Be Defined
 *
 *   + can be `undefined`.
 *   + 7 character shorten
 */
type TBD<T> = T | undefined;
/**
 * #### To Be Completed
 *
 *   + can be `null`.
 *   + 2 character shorten
 */
type TBC<T> = T | null;
type Maybe<T> = T | null | undefined;
/**
 * Remove readonly
 */
type Writable<T> = {
  -readonly [P in keyof T]: T[P];
};