import { readFileSync } from 'fs';
import { dirname, isAbsolute, join } from 'path';

/** Support Vite-style `import x from './file.svg?raw'` in the Capacitor esbuild bundle. */
export function rawImportPlugin() {
  return {
    name: 'raw-import',
    setup(build) {
      build.onResolve({ filter: /\?raw$/ }, (args) => {
        const bare = args.path.replace(/\?raw$/, '');
        const resolved = isAbsolute(bare)
          ? bare
          : join(args.resolveDir, bare);
        return { path: resolved, namespace: 'raw-file' };
      });
      build.onLoad({ filter: /.*/, namespace: 'raw-file' }, (args) => ({
        contents: `export default ${JSON.stringify(readFileSync(args.path, 'utf8'))};`,
        loader: 'js',
      }));
    },
  };
}
