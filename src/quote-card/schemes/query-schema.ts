import { z } from '@hono/zod-openapi'

const QuerySchema = z.object({
	quote: z.string().openapi({
		description: 'Quote to render',
		example: '如果你只读别人都在读的书，你就只能想别人所想。',
	}),
	author: z.string().openapi({
		description: 'Author of the quote',
		example: '村上春树',
	}),
	width: z.number({ coerce: true }).int().openapi({
		type: 'number',
		description: 'Width of the image',
		example: 600,
	}),
	height: z.number({ coerce: true }).int().openapi({
		type: 'number',
		description: 'Height of the image',
		example: 400,
	}),
})

export default QuerySchema
