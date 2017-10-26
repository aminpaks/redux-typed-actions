
export type Environment = 'production' |  'development';

export enum ActionTypes {
  start,
  success,
  failure,
}

export interface ActionSuffixes {
  [action: string]: string;
}
