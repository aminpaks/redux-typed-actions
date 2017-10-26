/**
 * @license Redux-Typed-Actions
 * (c) 2017 Amin Paks <amin.pakseresht@hotmail.com>
 * License: MIT
 */

import { ActionTypeKey } from './definers';

const { defineProperties } = Object;

export function getSafeClassName(input: ActionTypeKey): string {
  let inputAsString = input.toString();
  const match = /^symbol\((.*)\)$/i.exec(inputAsString);

  if (match !== null) {
    inputAsString = `SymbolAction_${match[1]}`; // `;
  }

  return inputAsString.replace(/\W/g, '_');
}

export function generateClassAction(input: ActionTypeKey): Function {
  const actionClassName = getSafeClassName(input);
  const actionClass: any = (new Function(`return function ${actionClassName}() { }`))(); // `;

  return actionClass;
}

export function defineClassActionProperties(classAction: Function, actionTypeName: ActionTypeKey, getMethod: Function): void {

  const isMethod: Function = (action: any) => {
    return action.type === actionTypeName;
  };
  const castMethod: Function = (action: any) => {
    return action;
  };

  defineProperties(classAction, {
    /**
     * Defines a static property to get the "type" key
     * of this action
     */
    type: {
      writable: false,
      enumerable: true,
      configurable: false,
      value: actionTypeName,
    },

    /**
     * Defines a static method to check if a plain action
     * has the same type key as this defined action.
     */
    is: {
      writable: false,
      enumerable: false,
      configurable: false,
      value: isMethod,
    },

    /**
     * Returns the plain action passed as argument with proper typings
     */
    cast: {
      writable: false,
      enumerable: false,
      configurable: false,
      value: castMethod,
    },

    /**
     * Returns a plain action with a proper typed payload.
     */
    get: {
      writable: false,
      enumerable: false,
      configurable: false,
      value: getMethod,
    },

    /**
     * Returns a plain action with a proper typed payload.
     */
    strictGet: {
      writable: false,
      enumerable: false,
      configurable: false,
      value: getMethod,
    },

  });

}
