## Redux Typed Actions

An opinionated approach to type actions and their payload in Redux with statically type checking in Typescript.
This approach removes the most possible boilerplate of your actions & their creators in React and any other frameworks.

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

0. You have an ItemX interface:  
    **feature-x.types.ts**
    ```ts
    export interface ItemX {
      title: string;
    }
    ```

1. First we define our actions:  
    **feature-x.actions.ts**
    ```ts
    import { defineAction, defineScenarioAction, defineSymbolAction } from 'redux-typed-actions';
    import { ItemX } from './feature-x.types';

    // For this action we will have number as our payload
    export const FeatureXAddTicketAction = defineAction<number>('[Feature X] Add Ticket');

    /**
     *  This action is special, it's called a scenario-like action
     *  It notifies the system with status of a process covering from start to end.
     *  You can get Start/Success/Failure from this action generator
     *  There are 3 types that belong respectively to Start/Success/Failure
     *  Note: The default type for payload of success and failure is
     *  string so you can skip them like `defineScenarioAction('MyActionName')` 
     */
    export const FeatureXLoadAction = defineScenarioAction<undefined, ItemX[], string>('[Feature X] Load');

    // Let's have a symbol action just for fun
    export const FeatureXDummySymbolAction = defineSymbolAction<ItemX[]>('[Feature X] Dummy Started');
    ```

    Note: You can setup your own suffix for Start/Success/Failure of scenario actions as following example:
    ```ts
    import { factory } from 'redux-typed-actions';
    
    // You must set them before defining actions
    factory.setSuffixes({
      start: '_REQUEST',
      success: '_SUCCESS',
      failure: '_FAILURE',
    });
    ```

2. Now we dispatch our actions:  
    **feature-x.component.ts**
    ```ts
    import { ItemX } from './feature-x.types';
    import { FeatureXAddTicketAction, FeatureXLoadAction } from '../feature-x.actions';
    ...

    // React Redux solution to replace action creators:
    // Let's define our component's state
    interface FeatureXProps {
      ...
      addTicket: typeof FeatureXAddTicketAction.strictGet; // StrictGet makes the payload mandatory
    }

    ...
    class FeatureX extends React.Component<FeatureXProps> {
      ...
      addTicket = () => this.props.addTicket(1) // <- Static type checking

      render() {
        return (<button onClick={this.addTicket}>Add one ticket</button>); // />
      }
    }

    // Let's hook the action to redux, and we're done
    export default connect(undefined, { addTicket: FeatureXAddTicketAction.strictGet })(FeatureX);


    // All Typescript frameworks:
    // Dispatching a simple action
    store.dispatch(FeatureXAddTicketAction.get(100));

    // Let's start our scenario by dispatching our action
    store.dispatch(FeatureXLoadAction.get());

    // Now we dispatch the success action
    const payload: ItemX[] = [{ title: 'item 1' }, { title: 'item 2' }];
    dispatch(FeatureXLoadAction.success.get(payload));

    // or simply a failure
    dispatch(FeatureXLoadAction.failure.get('It failed because...'));
    ```

3. Now let's take a look at our reducers to see how we can type check the payloads:  
   **feature-x.reducers.ts**
   ```ts
   import { PlainAction } from 'redux-typed-actions';
   import { ItemX } from './feature-x.types';
   import { FeatureXLoadAction } from '../feature-x.actions';

   export interface ItemXState {
     items: ItemX[];
     loading: boolean;
   }

   export function reducer(state: ItemXState = InitialState, action: PlainAction): ItemXState {
     if (FeatureXLoadAction.is(action)) {
       // Within this branch our action variable has the right typings
       return {
         ...state,
         loading: true,
       };

     } else if (FeatureXLoadAction.success.is(action)) {
       return {
         ...state,
         loading: false,
         items: action.payload, // <- Here we are checking types strongly :)
       };

     } else {
       return state;
     }
   }
   
   // Or using switch case
   export function reducer(state: ItemXState = InitialState, action: PlainAction): ItemXState {
     switch(true)
     case FeatureXLoadAction.is(action):
       // Within this branch our action variable has the right typings
       return {
         ...state,
         loading: true,
       };
     case FeatureXLoadAction.success.is(action): 
       return {
         ...state,
         loading: false,
         items: action.payload, // <- Here we are checking types strongly :)
       };
     default:
       return state;
   }
   ```

4. If you're fan of `redux-observables` then this part is for you:  
   **feature-x.epics.ts**
   ```ts
   (action$, store) => action$
      .ofType(FeatureXLoadAction.type)
      .map(action => FeatureXLoadAction.cast(action)) // <- from here we will have all the typings right :)
      .switchMap(action => Service()
          .map(value => FeatureXLoadAction.success.get(repos))
          .catch(() => Observable.of(FeatureXLoadAction.failure.get('Oops something went wrong!'))));
   ```

5. That's it


Take a look at [React](https://stackblitz.com/edit/react-redux-observable) or [Angular](https://stackblitz.com/edit/redux-typed-actions-example) examples for a closer look.
