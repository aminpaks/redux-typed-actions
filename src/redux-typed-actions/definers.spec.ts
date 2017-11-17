import { assert } from 'chai';
import { defineAction, defineScenarioAction } from './definers';
import { factory } from './factory';

describe('Define Actions', () => {
  factory.setSuffixes({
    start: ' Start',
    cancel: ' Cancel',
    success: ' Success',
    failure: ' Failure',
  });

  const SimpleAction = defineAction<string>('Simple Action');
  const ScenarioAction = defineScenarioAction<string, { value: number }, number, string>('Scenario Action');

  it('Action Simple & Scenario must be unique', () => {
    assert.isFunction(SimpleAction);
    assert.isFunction(ScenarioAction);
  });

  it('Checking simple action', () => {
    const simplePlainAction = SimpleAction.get('test', 'simple meta', true);

    assert.isObject(simplePlainAction);
    assert.isNotFunction(simplePlainAction);
    assert.isString(simplePlainAction.meta);
    assert.deepEqual(simplePlainAction.meta, 'simple meta');
    assert.isBoolean(simplePlainAction.error);
    assert.isNotNumber(simplePlainAction.error);

    assert.deepEqual(simplePlainAction.type, SimpleAction.type);
    assert.deepEqual(simplePlainAction.type, 'Simple Action');
    assert.deepEqual(simplePlainAction.payload, 'test');
    assert.deepEqual(SimpleAction.strictGet('test', 'simple meta', true), simplePlainAction);

    // Testing methods
    assert.isTrue(SimpleAction.is(simplePlainAction));
    assert.deepEqual(SimpleAction.cast(simplePlainAction), simplePlainAction);
    // testing cast payload deeply
    assert.equal(SimpleAction.cast<string[]>(simplePlainAction).payload, ['test']);
  });

  it('Checking scenario action', () => {
    const URL = 'URL://check';
    const cancelPayload = 'cancel ME!';
    const successPayload = {
      value: 100,
    };
    const failurePayload = 503;

    assert.isFunction(ScenarioAction.cancel);
    assert.isFunction(ScenarioAction.success);
    assert.isFunction(ScenarioAction.failure);
    assert.equal(ScenarioAction.type, 'Scenario Action Start');
    assert.equal(ScenarioAction.cancel.type, 'Scenario Action Cancel');
    assert.equal(ScenarioAction.success.type, 'Scenario Action Success');
    assert.equal(ScenarioAction.failure.type, 'Scenario Action Failure');

    const scenarioPlainStartAction = ScenarioAction.strictGet(URL);
    const scenarioPlainCancelAction = ScenarioAction.cancel.strictGet(cancelPayload);
    const scenarioPlainSuccessAction = ScenarioAction.success.strictGet(successPayload);
    const scenarioPlainFailureAction = ScenarioAction.failure.strictGet(failurePayload);

    assert.isString(scenarioPlainStartAction.type);
    assert.equal(scenarioPlainStartAction.type, 'Scenario Action Start');
    assert.equal(scenarioPlainCancelAction.type, 'Scenario Action Cancel');
    assert.equal(scenarioPlainSuccessAction.type, 'Scenario Action Success');
    assert.equal(scenarioPlainFailureAction.type, 'Scenario Action Failure');

    assert.equal(scenarioPlainStartAction.payload, URL);
    assert.equal(scenarioPlainCancelAction.payload, cancelPayload);
    assert.equal(scenarioPlainSuccessAction.payload, successPayload);
    assert.equal(scenarioPlainFailureAction.payload, failurePayload);
  });
});
