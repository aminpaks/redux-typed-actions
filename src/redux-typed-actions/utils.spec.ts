import { assert } from 'chai';
import {
  defineClassActionProperties,
  generateClassAction,
  getSafeClassName,
} from './utils';

describe('Utils', () => {
  it('getSafeClassName', () => {
    assert.isFunction(getSafeClassName);

    const className = getSafeClassName('A long name with 4ll [characters]');
    assert.equal(className, 'A_long_name_with_4ll__characters_');
  });

  it('generateClassAction', () => {
    const classAction = generateClassAction('A simple action');

    assert.isFunction(classAction);
    assert.equal(classAction.name, 'A_simple_action');
  });

  it('defineClassActionProperties', () => {
    const actionTypeName = 'sample';
    const classAction = generateClassAction(actionTypeName) as any;
    const getMethod = () => {};

    defineClassActionProperties(classAction, actionTypeName, getMethod);

    assert.equal(classAction.type, actionTypeName);
    assert.isFunction(classAction.is);
    assert.isFunction(classAction.get);
    assert.isFunction(classAction.strictGet);
    assert.isFunction(classAction.cast);
  });
});
