(function (root) {
  'use strict';

  var endpoint = 'https://api.chungdoi.com/api/invite/hongminh-khanhlinh/';
  var suggestions = [
    'Chúc hai bạn trăm năm hạnh phúc, luôn yêu thương và đồng hành cùng nhau!',
    'Chúc cô dâu chú rể một cuộc sống ngập tràn niềm vui và tiếng cười!',
    'Mừng ngày chung đôi! Chúc hai bạn mãi hạnh phúc bên nhau.',
    'Chúc tình yêu của hai bạn luôn bền chặt và ngọt ngào theo năm tháng!',
    'Chúc tổ ấm mới của hai bạn luôn bình an, ấm áp và đầy ắp yêu thương.',
    'Chúc hai bạn cùng nhau viết nên thật nhiều kỷ niệm đẹp trong cuộc sống mới.',
    'Chúc cô dâu chú rể mãi nắm tay nhau đi qua mọi chặng đường!',
    'Chúc hai bạn có một ngày cưới thật vui và một hành trình chung thật hạnh phúc.'
  ];

  function jsonResponse(body, status) {
    return new Response(JSON.stringify(body), { status: status || 200, headers: { 'Content-Type': 'application/json' } });
  }

  function createGuestbookFetch(next) {
    return async function (input, options) {
      var url = typeof input === 'string' ? input : input && input.url;
      var method = ((options && options.method) || (input && input.method) || 'GET').toUpperCase();
      if (url === endpoint + 'ai-wishes' && method === 'POST') {
        return jsonResponse({ wishes: suggestions.slice().sort(function () { return Math.random() - 0.5; }).slice(0, 5) });
      }
      if (url !== endpoint + 'comments' || (method !== 'GET' && method !== 'POST')) {
        return next.apply(this, arguments);
      }
      if (method === 'GET') {
        return next('/.netlify/functions/guestbook');
      }
      var body;
      try { body = JSON.parse(options.body); } catch (_) { return jsonResponse({ error: 'Dữ liệu không hợp lệ' }, 400); }
      var name = typeof body.name === 'string' ? body.name.trim() : '';
      var message = typeof body.message === 'string' ? body.message.trim() : '';
      if (!name || !message || Array.from(name).length > 100 || Array.from(message).length > 2000) {
        return jsonResponse({ error: 'Tên hoặc lời chúc không hợp lệ' }, 400);
      }
      return next('/.netlify/functions/guestbook', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: name, message: message }) });
    };
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { createGuestbookFetch: createGuestbookFetch };
    return;
  }
  root.fetch = createGuestbookFetch(root.fetch.bind(root));
})(typeof window === 'undefined' ? globalThis : window);
