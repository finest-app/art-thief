import { type z } from '@hono/zod-openapi'
import { ImageResponse } from '@vercel/og'
import type QuoteCardQuerySchema from './schemes/quote-card-query-schema'
import themes from './themes/themes'

const getQuoteCard = async ({
	author,
	quote,
	width,
	height,
	theme,
}: z.infer<typeof QuoteCardQuerySchema>) => {
	const currentTheme = themes.find((_theme) => _theme.name === theme)

	if (currentTheme === undefined) {
		throw new Error('Theme not found')
	}

	const quoteCard = new ImageResponse(
		(
			// @ts-expect-error
			<currentTheme.component quote={quote} author={author} />
		),
		{
			width,
			height,
			fonts: await currentTheme.fonts(),
		},
	)

	return quoteCard
}

export default getQuoteCard
