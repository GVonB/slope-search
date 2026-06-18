// ponytail: in-proc cache keyed by URL. Data is static between seeds, so no TTL or
// invalidation — just clear() on reseed. Swap for Redis only if the backend scales past one replica.
const store = new Map();

// Wrap a GET controller: serve cached JSON by full URL, otherwise run it and capture
// the response. Only array payloads are cached, so 500s ({error}) and favorites are skipped.
function cached(handler) {
  return (req, res) => {
    if (req.query.favorites === 'true') return handler(req, res); // per-user, mutable
    const key = req.originalUrl;
    if (store.has(key)) return res.json(store.get(key));

    const sendJson = res.json.bind(res);
    res.json = (body) => {
      if (Array.isArray(body)) store.set(key, body);
      return sendJson(body);
    };
    handler(req, res);
  };
}

cached.clear = () => store.clear();

module.exports = cached;

// ponytail: self-check — `node src/utils/cache.js`. Verifies hit/miss, that errors
// aren't cached, and that favorites bypass the cache entirely.
if (require.main === module) {
  const assert = require('assert');
  cached.clear();
  let calls = 0;
  const handler = cached((req, res) => {
    calls++;
    if (req.query.fail) return res.status(500).json({ error: 'boom' });
    res.json([req.originalUrl]);
  });
  const fakeRes = () => ({ status() { return this; }, json(b) { this.body = b; return b; } });

  let r = fakeRes(); handler({ originalUrl: '/a', query: {} }, r);          // miss
  handler({ originalUrl: '/a', query: {} }, r = fakeRes());                  // hit, handler not re-run
  assert.strictEqual(calls, 1, 'second identical request should be served from cache');

  handler({ originalUrl: '/b', query: { fail: 1 } }, fakeRes());            // error: not cached
  handler({ originalUrl: '/b', query: { fail: 1 } }, fakeRes());            // runs again
  assert.strictEqual(calls, 3, 'errors must not be cached');

  handler({ originalUrl: '/c', query: { favorites: 'true' } }, fakeRes());
  handler({ originalUrl: '/c', query: { favorites: 'true' } }, fakeRes());  // never cached
  assert.strictEqual(calls, 5, 'favorites must bypass the cache');

  console.log('cache.js self-check passed');
}
