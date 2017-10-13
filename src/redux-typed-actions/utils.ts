/**
 * @license Redux-Typed-Actions-Utils
 * (c) 2017 Amin Paks <amin.pakseresht@hotmail.com>
 * License: MIT
 */

import { ActionTypeKey } from './definers';

export function getSafeClassName(input: ActionTypeKey): string {
  let inputAsString = input.toString();
  const match = /^symbol\((.*)\)$/i.exec(inputAsString);

  if (match !== null) {
    inputAsString = `SymbolAction_${match[1]}`; // `;
  }

  return inputAsString.replace(/\W/g, '_');
}
