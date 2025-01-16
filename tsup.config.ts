import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: true,
  outDir: 'dist',
  target: 'node16',
  external: [
    "buffer-crc32",
    "crypto",
    "mercadopago",
    "stripe",
    "uuid"
  ]
}); 