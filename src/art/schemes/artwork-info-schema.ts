import { z } from '@hono/zod-openapi'

const artworkInfoSchema = z.object({
	'@type': z.literal('CreativeWork'),
	name: z.string(),
	author: z.string(),
	url: z.string(),
	description: z.string(),
	image: z.object({
		'@type': z.string(),
		contentUrl: z.string(),
		width: z.number(),
		height: z.number(),
	}),
})

export default artworkInfoSchema
