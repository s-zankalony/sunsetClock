const { test, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const axios = require('axios');
const getCityFromCoords = require('./getCityFromCoords');
const originalGet = axios.get;
afterEach(() => { axios.get = originalGet; });

function response() {
  return {
    statusCode: 200,
    status(code) { this.statusCode = code; return this; },
    send(body) { this.body = body; return this; }
  };
}

for (const [name, lat, lon] of [['New York', '40.7128', '-74.0060'], ['London', '51.5074', '-0.1278']]) {
  test(`returns ${name} for valid coordinates`, async () => {
    axios.get = async url => {
      const parsed = new URL(url);
      assert.equal(parsed.hostname, 'api.openweathermap.org');
      assert.equal(parsed.searchParams.get('lat'), lat);
      assert.equal(parsed.searchParams.get('lon'), lon);
      return { data: [{ name }] };
    };
    const res = response();
    await getCityFromCoords({ query: { lat, lon } }, res);
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, [{ name }]);
  });
}

test('returns 404 when coordinates have no matching location', async () => {
  axios.get = async () => ({ data: [] });
  const res = response();
  await getCityFromCoords({ query: { lat: '0', lon: '0' } }, res);
  assert.equal(res.statusCode, 404);
  assert.deepEqual(res.body, { message: 'No location found' });
});

test('preserves upstream error status and response', async t => {
  t.mock.method(console, 'log', () => {});
  axios.get = async () => { throw { response: { status: 400, data: { message: 'Invalid coordinates' } } }; };
  const res = response();
  await getCityFromCoords({ query: { lat: 'invalid', lon: 'invalid' } }, res);
  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, { message: 'Invalid coordinates' });
});

test('returns 500 for an upstream connection failure', async t => {
  t.mock.method(console, 'log', () => {});
  axios.get = async () => { throw new Error('Connection failed'); };
  const res = response();
  await getCityFromCoords({ query: { lat: '0', lon: '0' } }, res);
  assert.equal(res.statusCode, 500);
  assert.deepEqual(res.body, { message: 'Connection failed' });
});
