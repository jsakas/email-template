const fs = require('fs');
const path = require('path');
const nunjucks = require('nunjucks');
const inlineCss = require('inline-css');
const pretty = require('pretty');
const emailData = require('./email-data.json');

nunjucks.configure('src');

const REMOTE_STATIC_URL = 'https://my-server/images'
const DIST_DIR = path.resolve(__dirname, 'dist');
const LOCAL_STATIC_DIR = '/images';

const staticRegex = new RegExp(LOCAL_STATIC_DIR, "g");
const withStatic = s => s.replace(staticRegex, REMOTE_STATIC_URL);
const withPrettyHtml = s => pretty(s, {ocd: true});

try {
  fs.readdirSync(DIST_DIR)
} catch (e) {
  fs.mkdirSync(DIST_DIR, { recursive: true });
}

const compileFile = (inFile, outFile, data = {}) => {
  const compiled = nunjucks.render(inFile, data);
  return inlineCss(compiled, {
    url: '/',
    preserveMediaQueries: true,
    removeLinkTags: false,
  })
    // .then(withStatic)
    .then(withPrettyHtml)
    .then(html => fs.writeFileSync(outFile, html));
}

compileFile('font-test.html', path.resolve(DIST_DIR, 'font-test.html'));

emailData.forEach(data => {
  data.image_dir = LOCAL_STATIC_DIR;
  compileFile(
    data.template, 
    path.resolve(DIST_DIR, data.outfile),
    data
  )
});
