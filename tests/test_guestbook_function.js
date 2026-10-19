const assert = require('node:assert/strict');
const { handler } = require('../netlify/functions/guestbook.js');

(async () => {
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_ANON_KEY;
  assert.equal((await handler({ httpMethod: 'GET' })).statusCode, 503);
  process.env.SUPABASE_URL = 'https://example.supabase.co';
  process.env.SUPABASE_ANON_KEY = 'test-key';
  const requests = [];
  global.fetch = async (url, options) => {
    requests.push({ url, options });
    return options.method === 'POST'
      ? new Response(null, { status: 201 })
      : Response.json([{ name: 'An', message: 'Chúc mừng!' }]);
  };
  const list = await handler({ httpMethod: 'GET' });
  assert.equal(JSON.parse(list.body).comments[0].name, 'An');
  assert.equal(requests[0].options.headers.apikey, 'test-key');
  const sent = await handler({ httpMethod: 'POST', body: JSON.stringify({ name: ' An ', message: ' Hi ', visitor_id: 'private' }) });
  assert.equal(sent.statusCode, 200);
  assert.deepEqual(JSON.parse(requests[1].options.body), { name: 'An', message: 'Hi' });
  assert.equal((await handler({ httpMethod: 'POST', body: '{}' })).statusCode, 400);
  assert.equal((await handler({ httpMethod: 'DELETE' })).statusCode, 405);
  console.log('Guestbook function checks passed');
})().catch(error => { console.error(error); process.exitCode = 1; });
