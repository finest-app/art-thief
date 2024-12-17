import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { initWasm, Resvg } from '@resvg/resvg-wasm'
import { apiReference } from '@scalar/hono-api-reference'
import getQuoteCard from './quote-card/get-quote-card'
import QuerySchema from './quote-card/schemes/query-schema'
import renderer from './renderer'

const app = new OpenAPIHono()

if (false) {
	app.use(renderer)
}

let initlized = false

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
		if (initlized === false) {
			await initWasm('https://esm.sh/@resvg/resvg-wasm/index_bg.wasm')

			initlized = true
		}

		const { quote, author, width, height } = c.req.valid('query')

		const quoteCard = await getQuoteCard({ quote, author, width, height })

		const resvg = new Resvg(quoteCard)

		const png = resvg.render().asPng()

		return new Response(png, {
			headers: {
				'Content-Type': 'image/png',
			},
		})
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
