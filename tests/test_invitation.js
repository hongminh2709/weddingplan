const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const compat = require('../local/compat.js');

// Run the saved map component with a restricted Google Maps URL, as the
// original application does, and inspect the URL before an iframe is created.
const chunks = [];
const mapCode = fs.readFileSync('chungdoi.com/_next/static/chunks/71675-67fb0a51dac882ce.js', 'utf8');
vm.runInNewContext(mapCode, { self: { webpackChunk_N_E: chunks }, window: { weddingCompat: compat }, URL });
const mapExports = {};
const modules = {
  95155: { jsx: (type, props) => ({ type, props }) },
  12115: { memo: fn => fn },
  80497: { MG: () => 'https://www.google.com/maps/embed/v1/place?key=restricted&q=Nh%C3%A0%20v%C4%83n%20ho%C3%A1' },
  20063: { useSearchParams: () => new URLSearchParams() },
  18955: { c: () => () => '' },
};
function requireModule(id) { return modules[id]; }
requireModule.d = (target, definitions) => Object.entries(definitions).forEach(([key, getter]) => Object.defineProperty(target, key, { get: getter }));
chunks[0][1][1825](null, mapExports, requireModule);
const mapUtilities = {};
chunks[0][1][80497](null, mapUtilities, requireModule);
const generatedUrl = new URL(mapUtilities.MG({ address: 'Nhà văn hoá' }));
assert.equal(generatedUrl.hostname, 'maps.google.com');
assert.equal(generatedUrl.searchParams.get('q'), 'Nhà văn hoá');
assert.equal(generatedUrl.searchParams.has('key'), false);
const frame = mapExports.$({ address: 'Nhà văn hoá' });
assert.equal(frame.type, 'iframe');
assert.equal(new URL(frame.props.src).hostname, 'maps.google.com');
assert.equal(new URL(frame.props.src).searchParams.has('key'), false);
assert.equal(new URL(frame.props.src).searchParams.get('q'), 'Nhà văn hoá');

const scrollCode = fs.readFileSync('chungdoi.com/_next/static/chunks/2065-d547b56d1a80cad3.js', 'utf8');
assert.match(scrollCode, /if\(!e\)return 25;let t=parseInt\(e,10\);return isNaN\(t\)\|\|t<=0\?25:t/);
assert.match(mapCode, /className:"wedding-directions /);

// The saved layout should not mount the language prompt or support chat.
const layoutChunks = [];
const layoutCode = fs.readFileSync('chungdoi.com/_next/static/chunks/app/layout-bdf91ef526e3f491.js', 'utf8');
vm.runInNewContext(layoutCode, { self: { webpackChunk_N_E: layoutChunks } });
function layoutRequire() { return {}; }
layoutRequire.d = requireModule.d;
layoutRequire.n = value => value;
const language = {};
layoutChunks[0][1][38893](null, language, layoutRequire);
assert.equal(language.LocaleSuggestionBanner(), null);
const chat = {};
layoutChunks[0][1][96995](null, chat, layoutRequire);
assert.equal(chat.default(), null);
console.log('Invitation map and scroll checks passed');
