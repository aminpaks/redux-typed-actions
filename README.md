## Redux Typed Actions

An opinionated approach to type actions and their payload in Redux with statically type checking in Typescript (maybe flow in the future.)

## Installation
Let's get started by installing it from [npm repository](https://www.npmjs.com/package/redux-typed-actions)
```sh
$ npm install --save-dev redux-typed-actions
```
or from [yarn repository](https://yarnpkg.com/en/package/redux-typed-actions)
```sh
$ yarn add --dev redux-typed-actions
```

## Usage
Let's do a quick example to see how this approach can improve type checking of redux actions

1. First we define our actions:  
    **feature-x.actions.ts**
    ```ts
    import { defineAction, defineSymbolAction } from 'redux-typed-actions';
    import { ItemX } from './feature-x.types';

    // For this action we don't have any payload
    export const FeatureXLoadAction = defineAction('[Feature X] Load');

    // Let's have a payload, this action will carry a payload with an array of ItemX type
    export const FeatureXLoadSuccessAction = defineAction<ItemX[]>('[Feature X] Load Success');

    // Let's have a symbol action
    export const FeatureXDummySymbolAction = defineSymbolAction<ItemX[]>('[Feature X] Dummy Started');
    ```

2. Now we dispatch our actions:  
    **feature-x.component.ts**
    ```ts
    import { ItemX } from './feature-x.types';
    import { FeatureXLoadAction, FeatureXLoadSuccessAction } from '../feature-x.actions';
    ...
    store.dispatch(FeatureXLoadAction.get());

    // or in epics or side effects
    const payload: ItemX[] = [{ title: 'item 1' }, { title: 'item 2' }];
    store.dispatch(FeatureXLoadSuccessAction.get(payload));
    ```

3. Now let's take a look at our reducers to see how we can type check the payloads:  
   **feature-x.reducers.ts**
   ```ts
   import { PlainAction } from 'redux-typed-actions';
   import { ItemX } from './feature-x.types';
   import { FeatureXLoadAction, FeatureXLoadSuccessAction } from '../feature-x.actions';

   export interface ItemXState {
     items: ItemX[];
     loading: boolean;
   }

   ...
   export function reducer(state: ItemXState = InitialState, action: PlainAction): ItemXState {
     if (FeatureXLoadAction.is(action)) {
       // Within this branch our action variable has the right typings
       return {
         ...state,
         loading: true,
       }
     } else if (FeatureXLoadSuccessAction.is(action)) {
       return {
         ...state,
         loading: false,
         items: action.payload, // <- Here we are checking types strongly :)
       }
     } else {
       return state;
     }
   }
   ```

4. That's it :)
