import { Resvg } from '@resvg/resvg-js'
import { Hono } from 'hono'
import quote from './quote'
import renderer from './renderer'

const app = new Hono()

app.use(renderer)

app.get('/', async (c) => {
	const resvg = new Resvg(quote, {
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
