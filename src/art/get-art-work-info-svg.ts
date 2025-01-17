import { type z } from '@hono/zod-openapi'
import mql from '@microlink/mql'
import * as fontkit from 'fontkit'
import invariant from 'tiny-invariant'
import { renderToSVG, View, Image, Text } from '../indigo-otter'
import type ArtWorkInfoQuerySchema from './schemes/artwork-info-query-schema'
import artworkInfoSchema from './schemes/artwork-info-schema'
import translateEnToZh from './translateEnToZh'

const getArtworkInfoSVG = async ({
	url,
	translate,
}: z.infer<typeof ArtWorkInfoQuerySchema>) => {
	const { data } = await mql(url, {
		palette: true,
		data: { jsonLD: { selector: 'script[type="application/ld+json"]' } },
	})

	invariant(
		'jsonLD' in data &&
			Array.isArray(data.jsonLD) &&
			data.image &&
			data.image.palette,
		'No artwork found',
	)

	const artworkInfo = artworkInfoSchema.parse(data.jsonLD[0])

	const noto = await fetch(
		'https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-sc@latest/chinese-simplified-400-normal.ttf',
	)
		.then((response) => response.arrayBuffer())
		.then(
			(buffer) =>
				fontkit.create(new Uint8Array(buffer) as Buffer) as fontkit.Font,
		)

	const { svg } = renderToSVG(
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
					href: artworkInfo.image.contentUrl,
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
					children: data.image.palette.map(
						(color) =>
							new View({
								style: {
									width: 48,
									height: 48,
									borderRadius: 24,
									backgroundColor: color,
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
									text: translate ? await translateEnToZh(text) : text,
									font: noto,
									style: { color: '#2a2a2a', fontSize: 20 },
								}),
						),
				)),
			],
		}),
	)

	return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml' } })
}

export default getArtworkInfoSVG
