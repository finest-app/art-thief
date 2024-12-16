import { vValidator } from '@hono/valibot-validator'
import { Resvg } from '@resvg/resvg-js'
import { Hono } from 'hono'
import { object, string } from 'valibot'
import getQuoteCard from './getQuoteCard'
import renderer from './renderer'

const app = new Hono()

app.use(renderer)

app.get(
	'/',
	vValidator('query', object({ quote: string(), author: string() })),
	async (c) => {
		const { quote, author } = c.req.valid('query')

		const quoteCard = await getQuoteCard(quote, author)

		const resvg = new Resvg(quoteCard)

		const png = resvg.render().asPng()

		return new Response(png, {
			headers: {
				'Content-Type': 'image/png',
			},
		})
	},
)

export default app
