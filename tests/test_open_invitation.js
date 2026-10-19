const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const closedPage = fs.readFileSync('chungdoi.com/i/hongminh-khanhlinh.html', 'utf8');
const openPage = fs.readFileSync('chungdoi.com/i/hongminh-khanhlinhbaf7.html', 'utf8');
assert.match(closedPage, /href="hongminh-khanhlinhbaf7\.html"[^>]*rel="nofollow"/);
assert.match(openPage, /initialEnvelopeOpen\\":true/);

const chunks = [];
const coverCode = fs.readFileSync('chungdoi.com/_next/static/chunks/12374-b1a7b7e1dcc97ae1.js', 'utf8');
const linkStart = coverCode.indexOf('href:V??(0,_._L)("")');
assert.notEqual(linkStart, -1);
assert.doesNotMatch(coverCode.slice(linkStart, coverCode.indexOf(',onKeyDown:', linkStart)), /preventDefault/);
vm.runInNewContext(coverCode, { self: { webpackChunk_N_E: chunks }, URLSearchParams });
const linkExports = {};
const requireModule = {};
requireModule.d = (target, definitions) => Object.entries(definitions).forEach(([key, getter]) => Object.defineProperty(target, key, { get: getter }));
chunks[0][1][83955](null, linkExports, requireModule);
assert.equal(linkExports._L(''), 'hongminh-khanhlinhbaf7.html');
assert.equal(linkExports._L('open=1&guest=An'), 'hongminh-khanhlinhbaf7.html?guest=An');

assert.match(closedPage, /<script src="\/local\/open-invitation\.js"><\/script>/);
const redirect = fs.readFileSync('local/open-invitation.js', 'utf8');
function runRedirect(url) {
  let destination;
  const location = new URL(url);
  location.replace = value => { destination = value; };
  vm.runInNewContext(redirect, { window: { location }, URL, URLSearchParams });
  return destination;
}
assert.equal(runRedirect('https://example.test/chungdoi.com/i/hongminh-khanhlinh.html?open=1&guest=An#map'), '/chungdoi.com/i/hongminh-khanhlinhbaf7.html?guest=An#map');
assert.equal(runRedirect('https://example.test/chungdoi.com/i/hongminh-khanhlinh.html?guest=An'), undefined);
console.log('Invitation opening checks passed');
