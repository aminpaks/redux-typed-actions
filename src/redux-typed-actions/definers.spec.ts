import { assert } from 'chai';
import { defineAction, defineScenarioAction } from './definers';

describe('Define Actions', () => {
  const simpleAction = defineAction<string>('Simple Action');
  const scenarioAction = defineScenarioAction<string, { value: number }, number>('Scenario Action');

  it('Action Simple & Scenario must be unique', () => {
    assert.isFunction(simpleAction);
    assert.isFunction(scenarioAction);
  });

  it('Checking simple action', () => {
    const simplePlainAction = simpleAction.get('test');

    assert.isObject(simplePlainAction);
    assert.isNotFunction(simplePlainAction);
    assert.deepEqual(simplePlainAction.type, simpleAction.type);
    assert.deepEqual(simplePlainAction.payload, 'test');
    assert.deepEqual(simpleAction.strictGet('test'), simplePlainAction);

    // Testing methods
    assert.isTrue(simpleAction.is(simplePlainAction));
    assert.deepEqual(simpleAction.cast(simplePlainAction), simplePlainAction);
    // testing cast payload deeply
    assert.equal(simpleAction.cast<string[]>(simplePlainAction).payload, ['test']);
  });

  it('Checking scenario action', () => {
    const URL = 'URL://check';
    const successPayload = {
      value: 100,
    };
    const failurePayload = 503;

    assert.isFunction(scenarioAction.success);
    assert.isFunction(scenarioAction.failure);

    const scenarioPlainAction = scenarioAction.strictGet(URL);
    const scenarioPlainSuccessAction = scenarioAction.success.strictGet(successPayload);
    const scenarioPlainFailureAction = scenarioAction.failure.strictGet(failurePayload);

    assert.equal(scenarioPlainAction.payload, URL);
    assert.equal(scenarioPlainSuccessAction.payload, successPayload);
    assert.equal(scenarioPlainFailureAction.payload, failurePayload);
  });
});
