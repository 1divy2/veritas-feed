#!/usr/bin/env node
// Generates index.html for static SPA deployment from Vite SSR build output
import { readdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const assetsDir = join('dist', 'client', 'assets');
const files = readdirSync(assetsDir);

const cssFiles = files.filter(f => f.endsWith('.css'));
const indexJsFiles = files.filter(f => f.startsWith('index-') && f.endsWith('.js')).sort((a, b) => a.localeCompare(b));

const cssLinks = cssFiles.map(f => `    <link rel="stylesheet" href="/assets/${f}">`).join('\n');
const jsScripts = indexJsFiles.map(f => `    <script type="module" crossorigin src="/assets/${f}"></script>`).join('\n');

const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>VERITAS//FEED — Disinformation Intelligence Platform</title>
    <meta name="description" content="Real-time disinformation detection, narrative intelligence, and investigation management platform." />
${cssLinks}
  </head>
  <body>
    <div id="root"></div>
${jsScripts}
  </body>
</html>
`;

writeFileSync(join('dist', 'client', 'index.html'), html);
console.log('Generated dist/client/index.html');
console.log('  CSS:', cssFiles);
console.log('  JS:', indexJsFiles);
