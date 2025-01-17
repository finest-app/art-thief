import { z } from '@hono/zod-openapi'

const ArtWorkInfoQuerySchema = z.object({
	url: z.string().url().openapi({
		type: 'string',
		description: 'The URL of the artwork',
		example:
			'https://artsandculture.google.com/asset/woman-with-a-parasol-madame-monet-and-her-son-claude-monet/EwHxeymQQnprMg',
	}),
	translate: z.boolean().optional().openapi({
		type: 'boolean',
		description: 'Whether to translate the artwork information to Chinese',
		example: true,
	}),
	experimental: z.boolean().optional().openapi({
		type: 'boolean',
		description: 'Whether to enable experimental features',
		example: true,
	}),
})

export default ArtWorkInfoQuerySchema
