import { z } from '@hono/zod-openapi'
import themes from '../themes/themes'

const themeNames = themes.map((theme) => theme.name)

type ThemeName = (typeof themeNames)[number]
type ThemeArray = [ThemeName, ...ThemeName[]]

const QuoteCardQuerySchema = z.object({
	quote: z.string().openapi({
		description: 'Quote to render',
		example: '如果你只读别人都在读的书，你就只能想别人所想。',
	}),
	author: z.string().openapi({
		description: 'Author of the quote',
		example: '村上春树',
	}),
	width: z.number().or(z.string()).pipe(z.coerce.number().int()).openapi({
		type: 'number',
		description: 'Width of the image',
		example: 600,
	}),
	height: z.number().or(z.string()).pipe(z.coerce.number().int()).openapi({
		type: 'number',
		description: 'Height of the image',
		example: 400,
	}),
	theme: z.enum(themeNames as ThemeArray).openapi({
		type: 'string',
		enum: themeNames,
		description: 'Theme of the quote card',
		example: 'Paper',
	}),
})

export default QuoteCardQuerySchema
