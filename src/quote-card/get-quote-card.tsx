import satori from 'satori'
import type QuoteCard from './quote-card-types'
import paperTheme from './themes/paper-themes'

type ReactNode = Parameters<typeof satori>[0]

const getQuoteCard = async ({ author, quote }: QuoteCard.ComponentProps) => {
	const fontFileResponse = await fetch(
		'https://github.com/lxgw/LxgwWenKai-Lite/raw/refs/heads/main/fonts/TTF/LXGWWenKaiMonoLite-Light.ttf',
	).then((response) => response.arrayBuffer())

	const quoteCard = await satori(
		(<paperTheme.component author={author} quote={quote} />) as ReactNode,
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
