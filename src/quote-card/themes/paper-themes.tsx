import type QuoteCard from '../quote-card-types'

const paperTheme = {
	name: 'Paper',
	fonts: async () => {
		const fontFileResponse = await fetch(
			'https://github.com/lxgw/LxgwWenKai-Lite/raw/refs/heads/main/fonts/TTF/LXGWWenKaiMonoLite-Light.ttf',
		).then((response) => response.arrayBuffer())

		return [
			{
				name: 'LXGW WenKai Mono Lite Light',
				data: fontFileResponse,
				weight: 400,
				style: 'normal',
			},
		]
	},
	component: ({ quote, author }) => (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				width: '100%',
				height: '100%',
				backgroundColor: '#f8f9fa',
				padding: 20,
			}}
		>
			<p style={{ fontSize: 72 }}>”</p>
			<p
				style={{
					fontSize: 24,
					textWrap: 'balance',
				}}
			>
				{quote}
			</p>
			<p style={{ fontSize: 18, color: '#6c757d' }}>— {author}</p>
		</div>
	),
} as const satisfies QuoteCard.Theme

export default paperTheme
