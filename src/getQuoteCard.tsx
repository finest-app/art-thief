import satori from 'satori'

type ReactNode = Parameters<typeof satori>[0]

const getQuoteCard = async (quote: string, author: string) => {
	const fontFileResponse = await fetch(
		'https://github.com/lxgw/LxgwWenKai-Lite/raw/refs/heads/main/fonts/TTF/LXGWWenKaiMonoLite-Light.ttf',
	).then((response) => response.arrayBuffer())

	const quoteCard = await satori(
		(
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
		) as ReactNode,
		{
			width: 600,
			height: 400,
			fonts: [
				{
					name: 'LXGW WenKai Mono Lite Light',
					data: fontFileResponse,
					weight: 400,
					style: 'normal',
				},
			],
		},
	)

	return quoteCard
}

export default getQuoteCard
