import { type z } from '@hono/zod-openapi'
import satori from 'satori'
import type QuerySchema from './schemes/query-schema'
import paperTheme from './themes/paper-themes'

type ReactNode = Parameters<typeof satori>[0]

const getQuoteCard = async ({
	author,
	quote,
	width,
	height,
}: z.infer<typeof QuerySchema>) => {
	const theme = paperTheme

	const quoteCard = await satori(
		(<paperTheme.component author={author} quote={quote} />) as ReactNode,
		{
			width,
			height,
			fonts: await theme.fonts(),
		},
	)

	return quoteCard
}

export default getQuoteCard
