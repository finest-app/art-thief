import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { apiReference } from '@scalar/hono-api-reference'
import getQuoteCard from './quote-card/get-quote-card'
import QuerySchema from './quote-card/schemes/query-schema'
import renderer from './renderer'

const app = new OpenAPIHono()

if (false) {
	app.use(renderer)
}

app.openapi(
	createRoute({
		path: '/image',
		method: 'get',
		request: {
			query: QuerySchema,
		},
		responses: {
			200: {
				description: 'Image of quote card',
				content: {
					'image/png': {
						schema: {
							type: 'string',
							format: 'binary',
						},
					},
				},
			},
		},
	}),
	async (c) => {
		return getQuoteCard(c.req.valid('query'))
	},
)

app.doc31('/openapi.json', {
	openapi: '3.1.0',
	info: {
		title: 'Quote Card API',
		description: 'API for generating quote cards',
		version: '1',
	},
})

app.get(
	'/',
	apiReference({
		theme: 'deepSpace',
		darkMode: true,
		favicon: '/favicon.png',
		spec: {
			url: '/openapi.json',
		},
	}),
)

export default app
