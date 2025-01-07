import * as fontkit from 'fontkit'
import { Text, View } from '../../indigo-otter'
import type QuoteCard from '../quote-card-types'

const paperTheme = {
	name: 'Paper',
	component: async ({ quote, author, width }) => {
		const font = await fetch(
			'https://github.com/lxgw/LxgwWenKai-Lite/raw/refs/heads/main/fonts/TTF/LXGWWenKaiMonoLite-Light.ttf',
		)
			.then((response) => response.arrayBuffer())
			.then(
				(buffer) =>
					fontkit.create(new Uint8Array(buffer) as Buffer) as fontkit.Font,
			)

		return new View({
			style: {
				backgroundColor: '#f8f9fa',
				width,
				padding: 20,
				paddingBottom: 112,
				gap: 12,
			},
			children: [
				new Text({
					font,
					text: '”',
					style: {
						color: '#000',
						fontSize: 72,
					},
				}),
				new Text({
					font,
					text: quote,
					style: {
						color: '#000',
						fontSize: 24,
					},
				}),
				new Text({
					font,
					text: `— ${author}`,
					style: { color: '#6c757d', fontSize: 18 },
				}),
			],
		})
	},
} as const satisfies QuoteCard.Theme

export default paperTheme
