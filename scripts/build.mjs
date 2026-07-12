import * as esbuild from 'esbuild';
import { cpSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { rawImportPlugin } from './rawImportPlugin.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const dist = join(root, 'dist');

mkdirSync(dist, { recursive: true });

await esbuild.build({
  entryPoints: [join(root, 'src/main.tsx')],
  bundle: true,
  outfile: join(dist, 'assets/main.js'),
  format: 'iife',
  platform: 'browser',
  target: ['es2020'],
  loader: {
    '.css': 'css',
    '.png': 'file',
  },
  plugins: [rawImportPlugin()],
  // Match tsconfig "react-jsx" — avoids "React is not defined" in IIFE bundle
  jsx: 'automatic',
  jsxImportSource: 'react',
  define: { 'process.env.NODE_ENV': '"production"' },
  minify: true,
  sourcemap: true,
  splitting: false,
});

cpSync(join(root, 'public'), join(dist), { recursive: true });

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <base href="./" />
    <link rel="icon" href="./favicon.svg" type="image/svg+xml" />
    <link rel="icon" type="image/png" sizes="32x32" href="./favicon-32.png" />
    <link rel="icon" type="image/png" sizes="512x512" href="./favicon.png" />
    <link rel="apple-touch-icon" href="./apple-touch-icon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="#121a24" />
    <title>Boston 2026</title>
    <link rel="stylesheet" href="./assets/main.css" />
  </head>
  <body>
    <div id="root"></div>
    <noscript>Enable JavaScript to run this app.</noscript>
    <script src="./assets/main.js"></script>
  </body>
</html>
`;

writeFileSync(join(dist, 'index.html'), html, 'utf8');
console.log('Built dist/ (IIFE bundle for Capacitor/Android)');
