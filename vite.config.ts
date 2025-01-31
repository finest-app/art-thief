import build from '@hono/vite-cloudflare-pages'
import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/cloudflare'
import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
	plugins: [
		build({ emptyOutDir: true }),
		devServer({
			adapter,
			entry: 'src/index.tsx',
		}),
		viteStaticCopy({
			targets: [
				{
					src: 'node_modules/@resvg/resvg-wasm/index_bg.wasm',
					dest: '',
				},
			],
		}),
		{
			name: 'wasm-normalizer',
			config: () => ({
				build: { rollupOptions: { external: /\.wasm(\?.*)?$/ } },
			}),
			renderChunk: (code, renderedChunk) => {
				let result = code

				renderedChunk.imports.forEach((entry) => {
					if (entry.endsWith('.wasm?init') || entry.endsWith('.wasm?url')) {
						result = result.replace(
							entry,
							entry.replace(/.*\/([^\/]+\.wasm)\?.*/, './$1'),
						)
					}
				})

				return result
			},
		},
	],
})
