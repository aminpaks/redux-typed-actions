/**
 * @license Redux-Typed-Actions v0.1.4
 * (c) 2017 Amin Paks <amin.pakseresht@hotmail.com>
 * License: MIT
 */

import { factory } from './factory';
import { ActionTypes } from './types';
import { defineClassActionProperties, generateClassAction } from './utils';

const { defineProperties } = Object;

export type ActionTypeKey = string | symbol;

export interface PlainAction<P = any, TK extends ActionTypeKey = any> {
  type: TK;
  payload: P;
  meta: string;
  error: boolean;
}

export interface ClassAction<P, TK extends ActionTypeKey> {
  type: TK;
  is(action: PlainAction): action is PlainAction<P, TK>;
  cast<TCast = P>(action: PlainAction): PlainAction<TCast, TK>;
  get(payload?: P, meta?: string, error?: boolean): PlainAction<P, TK>;
  strictGet(payload: P, meta?: string, error?: boolean): PlainAction<P, TK>;
}

export interface SimpleClassAction<P, TK extends ActionTypeKey> extends ClassAction<P, TK> {
  get(payload?: P, meta?: string): PlainAction<P, TK>;
  strictGet(payload: P, meta?: string): PlainAction<P, TK>;
}

export interface ClassScenarioAction<P, SP, FP, CP, TK extends ActionTypeKey> extends ClassAction<P, TK> {
  cancel: SimpleClassAction<CP, TK>;
  success: SimpleClassAction<SP, TK>;
  failure: SimpleClassAction<FP, TK>;
  get(payload?: P, meta?: string): PlainAction<P, TK>;
  strictGet(payload: P, meta?: string): PlainAction<P, TK>;
}

/**
 *
 * @param {string} actionTypeName A string or a symbol to represent this action
 * @return {ClassAction<Payload, string>} Returns a class action that generates actions with string type key
 */
export function defineAction<Payload = undefined>(actionTypeName: string): ClassAction<Payload, string> {

  const prefixedActionTypeName = factory.getTypeName(actionTypeName, ActionTypes.empty);
  const classAction = generateClassAction(prefixedActionTypeName);
  const getMethod: Function = (payload = undefined, meta = undefined, error = false) => {
    return {
      type: actionTypeName,
      payload,
      meta,
      error,
    };
  };

  defineClassActionProperties(classAction, actionTypeName, getMethod);

  return classAction as any;
}

/**
 *
 * @param {string} actionTypeName A string or a symbol to represent this action
 * @return {ClassScenarioAction<Payload, SuccessPayload, FailurePayload, string>} Returns a scenario class action that generates actions with string type key
 */
export function defineScenarioAction<Payload = undefined, SuccessPayload = string, FailurePayload = string, CancelPayload = never>(actionTypeName: string):
  ClassScenarioAction<Payload, SuccessPayload, FailurePayload, CancelPayload, string> {

  const startActionTypeName = factory.getTypeName(actionTypeName, ActionTypes.start);
  const cancelActionTypeName = factory.getTypeName(actionTypeName, ActionTypes.cancel);
  const successActionTypeName = factory.getTypeName(actionTypeName, ActionTypes.success);
  const failureActionTypeName = factory.getTypeName(actionTypeName, ActionTypes.failure);

  const startClassAction = generateClassAction(startActionTypeName);
  const cancelClassAction = generateClassAction(cancelActionTypeName);
  const successClassAction = generateClassAction(successActionTypeName);
  const failureClassAction = generateClassAction(failureActionTypeName);

  const getMethod: Function = (type = '', error = false, payload = undefined, meta = undefined) => {
    return {
      type,
      payload,
      meta,
      error,
    };
  };

  defineClassActionProperties(startClassAction, startActionTypeName, getMethod.bind(null, startActionTypeName, false));
  defineClassActionProperties(cancelClassAction, cancelActionTypeName, getMethod.bind(null, cancelActionTypeName, false));
  defineClassActionProperties(successClassAction, successActionTypeName, getMethod.bind(null, successActionTypeName, false));
  defineClassActionProperties(failureClassAction, failureActionTypeName, getMethod.bind(null, failureActionTypeName, true));

  defineProperties(startClassAction, {

    /**
     * Returns a simple class action for cancel
     */
    cancel: {
      writable: false,
      enumerable: false,
      configurable: false,
      value: cancelClassAction,
    },

    /**
     * Returns a simple class action for success
     */
    success: {
      writable: false,
      enumerable: false,
      configurable: false,
      value: successClassAction,
    },

    /**
     * Returns a simple class action for failure
     */
    failure: {
      writable: false,
      enumerable: false,
      configurable: false,
      value: failureClassAction,
    },

  });

  return startClassAction as any;
}

/**
 *
 * @param {string} actionTypeName A string or a symbol to represent this action
 * @return {ClassAction<P, symbol>} Returns a class action that generates actions with symbol type key
 */
export function defineSymbolAction<P = undefined>(actionTypeName: string): SimpleClassAction<P, symbol> {
  return defineAction(Symbol(actionTypeName) as any) as any;
}
