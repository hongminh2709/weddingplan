const assert = require('node:assert/strict');
const { createGuestbookFetch } = require('../local/guestbook.js');
assert.equal(typeof createGuestbookFetch, 'function', 'guestbook adapter is available');
(async () => {
  const requests = [];
  const fetchStub = async (url, options = {}) => {
    requests.push({ url, options });
    if (options.method === 'POST') return new Response(null, { status: 201 });
    return Response.json({ comments: [{ id: '1', name: 'An', message: 'Chúc mừng!', timestamp: '2026-10-19T07:00:00Z' }] });
  };
  const fetch = createGuestbookFetch(fetchStub);
  const endpoint = 'https://api.chungdoi.com/api/invite/hongminh-khanhlinh/comments';
  const list = await (await fetch(endpoint)).json();
  assert.equal(list.comments[0].message, 'Chúc mừng!');
  assert.equal(requests[0].url, '/.netlify/functions/guestbook');
  assert.equal(requests[0].options.headers, undefined);
  const sent = await fetch(endpoint, { method: 'POST', body: JSON.stringify({name:' Bình ', message:' Chúc hạnh phúc ', visitor_id:'private'}) });
  assert.equal(sent.ok, true);
  assert.deepEqual(JSON.parse(requests[1].options.body), { name: 'Bình', message: 'Chúc hạnh phúc' });
  const failedFetch = createGuestbookFetch(async () => new Response('failed', {status: 403}));
  assert.equal((await failedFetch(endpoint, {method:'POST',body:JSON.stringify({name:'An',message:'Hi'})})).ok, false);
  const invalid = await fetch(endpoint, {method:'POST',body:JSON.stringify({name:' ',message:'Hi'})});
  assert.equal(invalid.status, 400);
  const suggestions = await (await fetch('https://api.chungdoi.com/api/invite/hongminh-khanhlinh/ai-wishes', { method:'POST' })).json();
  assert.equal(suggestions.wishes.length, 5);
  console.log('Guestbook checks passed');
})().catch(e => { console.error(e); process.exitCode = 1; });
