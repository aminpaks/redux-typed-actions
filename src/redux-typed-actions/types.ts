
export type Environment = 'production' |  'development';

export enum ActionTypes {
  empty,
  start,
  cancel,
  success,
  failure,
}

export interface ActionSuffixes {
  [action: string]: string;
}
