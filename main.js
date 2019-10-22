const fs = require('fs');
const path = require('path');
const nunjucks = require('nunjucks');
const inlineCss = require('inline-css');
const pretty = require('pretty');
const emailData = require('./email-data.json');

nunjucks.configure('src');

const REMOTE_STATIC_URL = "images/"
const DIST_DIR = path.resolve(__dirname, 'dist');

const withStatic = s => s.replace(/images\//g, REMOTE_STATIC_URL);
const withPrettyHtml = s => pretty(s);

try {
  fs.readdirSync(DIST_DIR)
} catch (e) {
  fs.mkdirSync(DIST_DIR, { recursive: true });
}

const compileFile = (inFile, outFile) => {
  const compiled = nunjucks.render(inFile);
  return inlineCss(compiled, {
    url: '/',
    preserveMediaQueries: true,
    removeLinkTags: false,
  })
    .then(withStatic)
    .then(withPrettyHtml)
    .then(html => fs.writeFileSync(outFile, html));
}

compileFile('font-test.html', path.resolve(DIST_DIR, 'font-test.html'));

emailData.forEach(data => {
  compileFile(data.template, path.resolve(DIST_DIR, data.outfile))
});
