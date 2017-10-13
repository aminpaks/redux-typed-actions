/**
 * @license Redux-Typed-Actions v0.0.2
 * (c) 2017 Amin Paks <amin.pakseresht@hotmail.com>
 * License: MIT
 */

import { getSafeClassName } from './utils';

export type ActionTypeKey = string | symbol;

export interface PlainAction<P = any, TK extends ActionTypeKey = any> {
  type: TK;
  payload: P;
  meta: string;
}

export interface ClassAction<P, TK extends ActionTypeKey = any> {
  type: TK;
  is(action: PlainAction): action is PlainAction<P, TK>;
  get(payload?: P, meta?: string): PlainAction<P, TK>;
  strictGet(payload: P, meta?: string): PlainAction<P, TK>;
}

/**
 *
 * @param {string} actionTypeName A string or a symbol to represent this action
 * @return {ClassAction<P, string>} Returns a class action that generates actions with string type key
 */
export function defineAction<P = undefined>(actionTypeName: string): ClassAction<P, string> {

  const actionClassName = getSafeClassName(actionTypeName);
  const classAction: any = (new Function(`return function ${actionClassName}() { }`))(); // `;

  const getFunction: Function = (payload = undefined, meta = undefined) => {
    return {
      type: actionTypeName,
      payload,
      meta,
    };
  };
  const isFunction: Function = (action: any) => {
    return action.type === actionTypeName;
  };

  Object.defineProperties(classAction, {
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
      value: isFunction,
    },

    /**
     * Generates a plain action with a proper typed payload.
     */
    get: {
      writable: false,
      enumerable: false,
      configurable: false,
      value: getFunction,
    },

    /**
     * Generates a plain action with a proper typed payload.
     */
    strictGet: {
      writable: false,
      enumerable: false,
      configurable: false,
      value: getFunction,
    },
  });

  return classAction;
}

/**
 *
 * @param {string} actionTypeName A string or a symbol to represent this action
 * @return {ClassAction<P, symbol>} Returns a class action that generates actions with symbol type key
 */
export function defineSymbolAction<P = undefined>(actionTypeName: string): ClassAction<P, symbol> {
  return defineAction(Symbol(actionTypeName) as any) as any;
}
