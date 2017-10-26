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
    if (process && process.env && process.env.NODE_ENV === 'production') {
      this.env = 'production';
    } else {
      this.env = 'development';
    }

    this.setSuffixes({
      empty: '',
      start: '',
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
