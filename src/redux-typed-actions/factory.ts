/**
 * @license Redux-Typed-Actions
 * (c) 2017 Amin Paks <amin.pakseresht@hotmail.com>
 * License: MIT
 */

import {
  ActionSuffixes,
  ActionTypes,
  Environment,
} from './types';

const { keys } = Object;

export class ClassActionFactory {
  private env: Environment;
  private suffixes: { [key: string]: string } = {};
  private registry: { [name: string]: boolean } = {};

  constructor() {
    /* tslint:disable:strict-type-predicates */
    if (typeof process !== 'undefined' && process.env != undefined && process.env.NODE_ENV === 'production') {
      this.env = 'production';
    } else {
      this.env = 'development';
    }
    /* tslint:enable:strict-type-predicates */

    this.setSuffixes({
      empty: '',
      start: '',
      cancel: ' Cancel',
      success: ' Success',
      failure: ' Failure',
    });
  }

  setEnvironment(value: Environment): void {
    this.env = value;
  }

  setSuffixes(inputs: ActionSuffixes): void {
    for (const key of keys(inputs)) {
      this.suffixes[key] = inputs[key];
    }
  }

  getSuffix(input: ActionTypes): string {
    return this.suffixes[ActionTypes[input]];
  }

  registerTypeName(name: string, type: ActionTypes): void {
    const actionTypeName = this.getTypeName(name, type);

    if (this.registry[actionTypeName]) {
      throw new Error(`Action with type name as "${name}" has already registered. You need define unique actions!`); // `;
    } else {
      this.registry[actionTypeName] = true;
    }
  }

  getTypeName(name: string, input: ActionTypes): string {
    const actionTypeName = name + this.getSuffix(input);

    return actionTypeName;
  }
}

export const factory = new ClassActionFactory();
