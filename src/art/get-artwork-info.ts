import { type z } from '@hono/zod-openapi'
import { Resvg } from '@resvg/resvg-wasm'
import * as cheerio from 'cheerio/slim'
import * as fontkit from 'fontkit'
import invariant from 'tiny-invariant'
import initResvg from '../helpers/initResvg'
import { renderToSVG, View, Image, Text } from '../indigo-otter'
import type ArtWorkInfoQuerySchema from './schemes/artwork-info-query-schema'
import artworkInfoSchema from './schemes/artwork-info-schema'

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
		'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.ttf',
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
				padding: 20,
				gap: 20,
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
				new View({
					children: [
						new Text({
							text: artworkInfo.name.split('-')[0],
							font: noto,
							style: { color: '#1a1a1a', fontSize: 20 },
						}),
						new Text({
							text: artworkInfo.author,
							font: noto,
							style: { color: '#4a4a4a', fontSize: 16 },
						}),
					],
				}),
				new Text({
					text: artworkInfo.description,
					font: noto,
					style: { color: '#2a2a2a', fontSize: 20 },
				}),
			],
		}),
	)

	await initResvg()

	const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: width } })

	resvg.resolveImage(
		artworkInfo.image.contentUrl,
		await fetch(artworkInfo.image.contentUrl)
			.then((response) => response.arrayBuffer())
			.then((buffer) => new Uint8Array(buffer)),
	)

	const renderedImage = resvg.render()

	const png = renderedImage.asPng()

	renderedImage.free()

	resvg.free()

	return new Response(png, { headers: { 'Content-Type': 'image/png' } })
}

export default getArtworkInfo
