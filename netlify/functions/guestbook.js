'use strict';

const response = (statusCode, body) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

exports.handler = async function (event) {
  const method = event.httpMethod;
  if (method !== 'GET' && method !== 'POST') return response(405, { error: 'Phương thức không được hỗ trợ' });
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return response(503, { error: 'Sổ lưu bút hiện không khả dụng' });
  const headers = { apikey: key, Authorization: `Bearer ${key}` };
  let path = '/rest/v1/guestbook?select=id,name,message,timestamp&order=timestamp.desc&limit=100';
  const options = { method, headers };
  if (method === 'POST') {
    let body;
    try { body = JSON.parse(event.body); } catch (_) { return response(400, { error: 'Dữ liệu không hợp lệ' }); }
    const name = typeof body?.name === 'string' ? body.name.trim() : '';
    const message = typeof body?.message === 'string' ? body.message.trim() : '';
    if (!name || !message || Array.from(name).length > 100 || Array.from(message).length > 2000) return response(400, { error: 'Tên hoặc lời chúc không hợp lệ' });
    path = '/rest/v1/guestbook';
    headers['Content-Type'] = 'application/json';
    headers.Prefer = 'return=minimal';
    options.body = JSON.stringify({ name, message });
  }
  try {
    const result = await fetch(url.replace(/\/$/, '') + path, options);
    if (!result.ok) return response(502, { error: 'Không thể kết nối sổ lưu bút' });
    return response(200, method === 'GET' ? { comments: await result.json() } : { stored: true });
  } catch (_) {
    return response(502, { error: 'Không thể kết nối sổ lưu bút' });
  }
};
