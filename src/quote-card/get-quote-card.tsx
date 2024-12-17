import { type z } from '@hono/zod-openapi'
import { ImageResponse } from '@vercel/og'
import type QuerySchema from './schemes/query-schema'
import paperTheme from './themes/paper-themes'

const getQuoteCard = async ({
	author,
	quote,
	width,
	height,
}: z.infer<typeof QuerySchema>) => {
	const theme = paperTheme

	const quoteCard = new ImageResponse(
		(
			// @ts-expect-error
			<paperTheme.component quote={quote} author={author} />
		),
		{
			width,
			height,
			fonts: await theme.fonts(),
		},
	)

	return quoteCard
}

export default getQuoteCard
