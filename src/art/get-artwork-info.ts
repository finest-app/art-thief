import { type z } from '@hono/zod-openapi'
import { Resvg } from '@resvg/resvg-wasm'
import * as cheerio from 'cheerio/slim'
import * as fontkit from 'fontkit'
import invariant from 'tiny-invariant'
import initResvg from '../helpers/initResvg'
import { renderToSVG, View, Image, Text } from '../indigo-otter'
import getImageColors from './get-image-colors'
import type ArtWorkInfoQuerySchema from './schemes/artwork-info-query-schema'
import artworkInfoSchema from './schemes/artwork-info-schema'
import translateEnToZh from './translateEnToZh'

const getArtworkInfo = async ({
	url,
}: z.infer<typeof ArtWorkInfoQuerySchema>) => {
	const html = await fetch(url).then((response) => response.text())

	const $ = cheerio.load(html)

	const json = JSON.parse(
		$('script[type="application/ld+json"]').text().replaceAll('\n', '\\n'),
	)

	invariant(Array.isArray(json), 'JSON-LD script is not an array')

	const artworkInfo = artworkInfoSchema.parse(json[0])

	invariant(artworkInfo, 'No artwork found')

	const noto = await fetch(
		'https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-sc@latest/chinese-simplified-400-normal.ttf',
	)
		.then((response) => response.arrayBuffer())
		.then(
			(buffer) =>
				fontkit.create(new Uint8Array(buffer) as Buffer) as fontkit.Font,
		)

	const imageURL = artworkInfo.image.contentUrl

	const imageResponse = await fetch(imageURL)

	const clonedImageResponse = imageResponse.clone()

	const colors = await getImageColors(await imageResponse.blob())

	const { svg, width } = renderToSVG(
		new View({
			style: {
				backgroundColor: '#f9fafb',
				padding: 32,
				gap: 20,
				borderRadius: 8,
				width: 824,
			},
			children: [
				new Image({
					href: imageURL,
					style: {
						width: '100%',
						borderRadius: 8,
						aspectRatio: artworkInfo.image.width / artworkInfo.image.height,
					},
				}),
				new View({
					style: {
						gap: 4,
					},
					children: [
						new Text({
							text: artworkInfo.name.split('-')[0],
							font: noto,
							style: { color: '#1a1a1a', fontSize: 24 },
						}),
						new Text({
							text: artworkInfo.author,
							font: noto,
							style: { color: '#4a4a4a', fontSize: 20 },
						}),
					],
				}),
				new View({
					style: { flexDirection: 'row', gap: 12 },
					children: colors.map(
						(color) =>
							new View({
								style: {
									width: 48,
									height: 48,
									borderRadius: 24,
									backgroundColor: color.hex,
								},
							}),
					),
				}),
				...(await Promise.all(
					artworkInfo.description
						.replaceAll('<p>', '')
						.replaceAll('</p>', '')
						.split('\n')
						.map(
							async (text) =>
								new Text({
									text: await translateEnToZh(text),
									font: noto,
									style: { color: '#2a2a2a', fontSize: 20 },
								}),
						),
				)),
			],
		}),
	)

	await initResvg()

	const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: width } })

	resvg.resolveImage(
		artworkInfo.image.contentUrl,
		await clonedImageResponse
			.arrayBuffer()
			.then((buffer) => new Uint8Array(buffer)),
	)

	const renderedImage = resvg.render()

	const png = renderedImage.asPng()

	renderedImage.free()

	resvg.free()

	return new Response(png, { headers: { 'Content-Type': 'image/png' } })
}

export default getArtworkInfo
