import { z } from '@hono/zod-openapi'
import themes from '../themes/themes'

const themeNames = themes.map((theme) => theme.name)

type ThemeName = (typeof themeNames)[number]
type ThemeArray = [ThemeName, ...ThemeName[]]

const QuoteCardQuerySchema = z.object({
	quote: z.string().openapi({
		description: 'Quote to render',
		example: '阅读一本书有两个动机：一是你喜欢这本书；二是你可以夸耀这本书。',
	}),
	author: z.string().openapi({
		description: 'Author of the quote',
		example: '伯特兰·罗素',
	}),
	width: z.number().or(z.string()).pipe(z.coerce.number().int()).openapi({
		type: 'number',
		description: 'Width of the image',
		example: 600,
	}),
	theme: z.enum(themeNames as ThemeArray).openapi({
		type: 'string',
		enum: themeNames,
		description: 'Theme of the quote card',
		example: 'Paper',
	}),
})

export default QuoteCardQuerySchema
