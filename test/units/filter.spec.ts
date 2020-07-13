import test from 'japa'
import Filter from "App/Helpers/Filter";

test.group('Filter', () => {
  test('Query strings', (assert) => {
    const queryString = {
      field_num: '1',
      field_bool: 'true',
      field_str: '"test"',
      field_out: '---',
    }
    const filters = [{
      'column': 'field_num',
      'type': 'number',
    },{
      'column': 'field_bool',
      'type': 'boolean',
    },{
      'column': 'field_str',
      'type': 'string',
    },]

    const clauses = Filter.apply(queryString, filters)
    assert.containsAllKeys(clauses, {
      field_num: '',
      field_bool: '',
      field_str: '',
    })
  })
})
