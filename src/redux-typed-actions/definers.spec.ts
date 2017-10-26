import { assert } from 'chai';
import { defineAction, defineScenarioAction } from './definers';
import { factory } from './factory';

describe('Define Actions', () => {
  factory.setSuffixes({
    start: ' Start',
    success: ' Success',
    failure: ' Failure',
  });

  const simpleAction = defineAction<string>('Simple Action');
  const scenarioAction = defineScenarioAction<string, { value: number }, number>('Scenario Action');

  it('Action Simple & Scenario must be unique', () => {
    assert.isFunction(simpleAction);
    assert.isFunction(scenarioAction);
  });

  it('Checking simple action', () => {
    const simplePlainAction = simpleAction.get('test', 'simple meta', true);

    assert.isObject(simplePlainAction);
    assert.isNotFunction(simplePlainAction);
    assert.isString(simplePlainAction.meta);
    assert.deepEqual(simplePlainAction.meta, 'simple meta');
    assert.isBoolean(simplePlainAction.error);
    assert.isNotNumber(simplePlainAction.error);

    assert.deepEqual(simplePlainAction.type, simpleAction.type);
    assert.deepEqual(simplePlainAction.type, 'Simple Action');
    assert.deepEqual(simplePlainAction.payload, 'test');
    assert.deepEqual(simpleAction.strictGet('test', 'simple meta', true), simplePlainAction);

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
    assert.equal(scenarioAction.type, 'Scenario Action Start');
    assert.equal(scenarioAction.success.type, 'Scenario Action Success');
    assert.equal(scenarioAction.failure.type, 'Scenario Action Failure');

    const scenarioPlainStartAction = scenarioAction.strictGet(URL);
    const scenarioPlainSuccessAction = scenarioAction.success.strictGet(successPayload);
    const scenarioPlainFailureAction = scenarioAction.failure.strictGet(failurePayload);

    assert.isString(scenarioPlainStartAction.type);

    assert.equal(scenarioPlainStartAction.payload, URL);
    assert.equal(scenarioPlainSuccessAction.payload, successPayload);
    assert.equal(scenarioPlainFailureAction.payload, failurePayload);
  });
});
