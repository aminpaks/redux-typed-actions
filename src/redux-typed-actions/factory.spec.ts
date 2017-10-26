import { assert } from 'chai';
import { factory } from './factory';
import { ActionTypes } from './types';

describe('Factory', () => {
  it('set & get Suffixes', () => {
    const start = '_START';
    const success = '_SUCCESS';
    const failure = '_FAILURE';

    factory.setSuffixes({
      start,
      success,
      failure,
    });

    const actionTypeName = 'SIMPLE';
    const actionStart = factory.getTypeName(actionTypeName, ActionTypes.start);
    const actionSuccess = factory.getTypeName(actionTypeName, ActionTypes.success);
    const actionFailure = factory.getTypeName(actionTypeName, ActionTypes.failure);

    assert.equal(actionStart, actionTypeName + start);
    assert.equal(actionSuccess, actionTypeName + success);
    assert.equal(actionFailure, actionTypeName + failure);
  });

  it('getActionTypeName', () => {
    const typeName = 'CHECK';
    const actionTypeName = factory.getTypeName(typeName, ActionTypes.start);
    const actionSuccessTypeName = factory.getTypeName(typeName, ActionTypes.success);
    const actionFailureTypeName = factory.getTypeName(typeName, ActionTypes.failure);

    const startSuffix = factory.getSuffix(ActionTypes.start);
    const successSuffix = factory.getSuffix(ActionTypes.success);
    const failureSuffix = factory.getSuffix(ActionTypes.failure);

    assert.equal(actionTypeName, typeName + startSuffix);
    assert.equal(actionSuccessTypeName, typeName + successSuffix);
    assert.equal(actionFailureTypeName, typeName + failureSuffix);
  });

  it('registerActionTypeName', (done) => {
    const actionName = 'CHECK';

    factory.registerTypeName(actionName, ActionTypes.start);
    factory.registerTypeName(actionName, ActionTypes.success);
    factory.registerTypeName(actionName, ActionTypes.failure);

    try {
      factory.registerTypeName(actionName, ActionTypes.start);

      // Should not reach this line
      done('Should throw an exception here!');
    } catch (e) { }

    done();
  });
});
