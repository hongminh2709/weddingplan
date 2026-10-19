(function () {
  'use strict';

  var current = new URL(window.location.href);
  if (current.searchParams.get('open') !== '1') return;
  if (!current.pathname.endsWith('/hongminh-khanhlinh.html')) return;

  current.pathname = current.pathname.replace(/hongminh-khanhlinh\.html$/, 'hongminh-khanhlinhbaf7.html');
  current.searchParams.delete('open');
  window.location.replace(current.pathname + current.search + current.hash);
})();
