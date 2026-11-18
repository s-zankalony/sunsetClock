import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lookupErrorMessage, validCityData } from '../frontend/lib/cityLookup.js';
for (const [status, pattern] of [[404,/City not found/],[400,/valid city/],[429,/Too many/],[401,/configuration/],[403,/configuration/],[500,/temporarily unavailable/],[502,/temporarily unavailable/]]) {
  test(`handles HTTP ${status}`, () => assert.match(lookupErrorMessage({response:{status}}),pattern));
}
test('network and timeout messages differ', () => {
  assert.match(lookupErrorMessage({}), /connection/);
  assert.match(lookupErrorMessage({code:'ECONNABORTED'}), /timed out/);
});
test('accepts zero timezone and rejects malformed responses', () => {
  assert.equal(validCityData({sys:{sunset:123,country:'GB'},timezone:0,name:'London'}),true);
  for(const data of [null,{}, {sys:{sunset:'123',country:'GB'},timezone:0,name:'London'}]) assert.equal(validCityData(data),false);
});
