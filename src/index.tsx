import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { apiReference } from '@scalar/hono-api-reference'
import getArtworkInfoSVG from './art/get-art-work-info-svg'
import getArtworkInfo from './art/get-artwork-info'
import ArtWorkInfoQuerySchema from './art/schemes/artwork-info-query-schema'
import getQuoteCard from './quote-card/get-quote-card'
import QuoteCardQuerySchema from './quote-card/schemes/quote-card-query-schema'
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
			query: QuoteCardQuerySchema,
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

app.openapi(
	createRoute({
		path: '/art',
		method: 'get',
		request: {
			query: ArtWorkInfoQuerySchema,
		},
		responses: {
			200: {
				description: 'Artwork information',
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
	(c) => {
		return getArtworkInfo(c.req.valid('query'))
	},
)

app.openapi(
	createRoute({
		path: '/art-svg',
		method: 'get',
		request: {
			query: ArtWorkInfoQuerySchema,
		},
		responses: {
			200: {
				description: 'Artwork information',
				content: {
					'image/svg+xml': {
						schema: {
							type: 'string',
						},
					},
				},
			},
		},
	}),
	(c) => {
		return getArtworkInfoSVG(c.req.valid('query'))
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
