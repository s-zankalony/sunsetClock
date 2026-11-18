// Offline regression coverage for the dependency upgrade. Run after the frontend build.
const assert = require('node:assert/strict');
const http = require('node:http');
const axios = require('axios');
const proxyaddr = require('proxy-addr');
const app = require('../app');

async function main() {
  // Do not trust attacker-supplied forwarding headers with the application's default settings.
  assert.equal(app.get('trust proxy'), false);
  const trust = proxyaddr.compile('127.0.0.1/8');
  assert.equal(trust('127.0.0.1'), true);
  assert.equal(trust('203.0.113.10'), false);

  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const request = (path, config = {}) => axios.get(`${base}${path}`, { proxy: false, ...config });
  try {
    const root = await request('/');
    assert.equal(root.status, 200);
    assert.match(root.data, /<html/i);
    const fallback = await request('/a-client-route', { headers: { 'X-Forwarded-For': '127.0.0.1' } });
    assert.equal(fallback.status, 200);
    assert.equal(fallback.data, root.data);
    const preflight = await axios.options(`${base}/api/v1/getCity`, {
      proxy: false, headers: { Origin: 'https://example.com', 'Access-Control-Request-Method': 'GET' }
    });
    assert.equal(preflight.status, 204);
    assert.equal(preflight.headers['access-control-allow-origin'], '*');

    // Exercise each real controller with controlled upstream data, not a live API key.
    const originalGet = axios.get;
    try {
      for (const [name, query, data] of [
        ['getCityFromCoords', { lat: '31.2', lon: '29.9' }, [{ name: 'Alexandria' }]],
        ['getSunsetData', { city: 'Alexandria' }, { name: 'Alexandria', sys: { sunset: 1731940000 } }]
      ]) {
        axios.get = async url => {
          assert.ok(new URL(url).hostname === 'api.openweathermap.org');
          return { data };
        };
        let sent;
        await require(`../controllers/${name}`)({ query }, { send(value) { sent = value; } });
        assert.deepEqual(sent, data);
      }
    } finally { axios.get = originalGet; }
    // Axios must reject malformed absolute URLs rather than making an unexpected request.
    await assert.rejects(() => axios.get('http://[invalid', { proxy: false }));
    console.log('Dependency smoke checks passed');
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
