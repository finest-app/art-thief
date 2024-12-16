import { Resvg } from '@resvg/resvg-js'
import { Hono } from 'hono'
import getQuoteCard from './getQuoteCard'
import renderer from './renderer'

const app = new Hono()

app.use(renderer)

const quotes = [
	{
		content: '如果你只读别人都在读的书，你就只能想别人所想。',
		author: '村上春树',
	},
	{
		content: '阅读一本书有两个动机：一是你喜欢这本书；二是你可以夸耀这本书。',
		author: '伯特兰·罗素',
	},
]

app.get('/', async (c) => {
	const quote = quotes[Math.floor(Math.random() * quotes.length)]

	const quoteCard = await getQuoteCard(quote.content, quote.author)

	const resvg = new Resvg(quoteCard, {
		fitTo: { mode: 'original' },
		font: {
			loadSystemFonts: true,
		},
	})

	const dataURL = resvg.render().asPng().toString('base64')

	return c.render(
		<h1>
			<img src={`data:image/png;base64,${dataURL}`} alt="Quote" />
		</h1>,
	)
})

export default app
