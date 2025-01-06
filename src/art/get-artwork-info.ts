import { type z } from '@hono/zod-openapi'
import { initWasm, Resvg } from '@resvg/resvg-wasm'
import wasm from '@resvg/resvg-wasm/index_bg.wasm?url'
import * as cheerio from 'cheerio'
import * as fontkit from 'fontkit'
import invariant from 'tiny-invariant'
import { renderToSVG, View, Image, Text } from '../indigo-otter'
import type ArtWorkInfoQuerySchema from './schemes/artwork-info-query-schema'
import artworkInfoSchema from './schemes/artwork-info-schema'

let wasmInitialized = false

const getArtworkInfo = async ({
	url,
}: z.infer<typeof ArtWorkInfoQuerySchema>) => {
	const html = await fetch(url).then((response) => response.text())

	const $ = cheerio.load(html)

	const json = JSON.parse($('script[type="application/ld+json"]').text())

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
						width: '100%',
						aspectRatio: artworkInfo.image.width / artworkInfo.image.height,
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
