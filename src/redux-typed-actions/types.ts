
export type Environment = 'production' |  'development';

export enum ActionTypes {
  empty,
  start,
  success,
  failure,
}

export interface ActionSuffixes {
  [action: string]: string;
}
