import { type z } from '@hono/zod-openapi'
import { initWasm, Resvg } from '@resvg/resvg-wasm'
import wasm from '@resvg/resvg-wasm/index_bg.wasm?url'
import * as fontkit from 'fontkit'
import { parseHTML } from 'linkedom'
import invariant from 'tiny-invariant'
import { renderToSVG, View, Image, Text } from '../indigo-otter'
import type ArtWorkInfoQuerySchema from './schemes/artwork-info-query-schema'
import artworkInfoSchema from './schemes/artwork-info-schema'

let wasmInitialized = false

const getArtworkInfo = async ({
	url,
}: z.infer<typeof ArtWorkInfoQuerySchema>) => {
	const html = await fetch(url).then((response) => response.text())

	const { document } = parseHTML(html)

	const script = document.querySelector('script[type="application/ld+json"]')

	invariant(script && script.textContent, 'No JSON-LD script found')

	const json = JSON.parse(script.textContent)

	invariant(Array.isArray(json), 'JSON-LD script is not an array')

	const artworkInfo = artworkInfoSchema.parse(json[0])

	invariant(artworkInfo, 'No artwork found')

	const noto = await fetch(
		'https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-sc@latest/chinese-simplified-400-normal.woff2',
	)
		.then((response) => response.arrayBuffer())
		.then(
			(buffer) =>
				fontkit.create(new Uint8Array(buffer) as Buffer) as fontkit.Font,
		)

	const ascpectRatio = artworkInfo.image.width / artworkInfo.image.height

	const { svg, width } = renderToSVG(
		new View({
			style: {
				backgroundColor: '#f9fafb',
				padding: 40,
				gap: 24,
				alignItems: 'center',
				borderRadius: 8,
				width: 800,
			},
			children: [
				new Image({
					href: artworkInfo.image.contentUrl,
					style: {
						borderRadius: 8,
						width: 720,
						height: 720 / ascpectRatio,
					},
				}),
				new Text({
					text: artworkInfo.description
						.replaceAll('<p>', '')
						.replaceAll('</p>', ''),
					font: noto,
					style: { color: '#2a2a2a', fontSize: 17 },
				}),
			],
		}),
	)

	if (wasmInitialized === false) {
		await initWasm(
			import.meta.env.DEV
				? fetch('https://esm.sh/@resvg/resvg-wasm/index_bg.wasm')
				: wasm,
		)

		wasmInitialized = true
	}

	const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: width } })

	resvg.resolveImage(
		artworkInfo.image.contentUrl,
		await fetch(artworkInfo.image.contentUrl)
			.then((response) => response.arrayBuffer())
			.then((buffer) => new Uint8Array(buffer)),
	)

	const renderedImage = resvg.render()

	const image = renderedImage.asPng()

	renderedImage.free()

	return new Response(image, { headers: { 'Content-Type': 'image/png' } })
}

export default getArtworkInfo
