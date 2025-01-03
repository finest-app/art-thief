import { z } from '@hono/zod-openapi'

const ArtWorkInfoQuerySchema = z.object({
	url: z.string().url().openapi({
		type: 'string',
		description: 'The URL of the artwork',
		example:
			'https://artsandculture.google.com/asset/the-bridge-at-argenteuil-0036/CQGVAX9Xla6sag',
	}),
})

export default ArtWorkInfoQuerySchema
