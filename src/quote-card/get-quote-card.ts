import { type z } from '@hono/zod-openapi'
import { Resvg } from '@resvg/resvg-wasm'
import initResvg from '../helpers/initResvg'
import { renderToSVG } from '../indigo-otter'
import type QuoteCardQuerySchema from './schemes/quote-card-query-schema'
import themes from './themes/themes'

const getQuoteCard = async ({
	author,
	quote,
	width,
	theme,
}: z.infer<typeof QuoteCardQuerySchema>) => {
	const currentTheme = themes.find((_theme) => _theme.name === theme)

	if (currentTheme === undefined) {
		throw new Error('Theme not found')
	}

	await initResvg()

	const { svg } = renderToSVG(
		await currentTheme.component({ author, quote, width }),
	)

	const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: width } })

	const renderedImage = resvg.render()

	const image = renderedImage.asPng()

	renderedImage.free()

	return new Response(image, { headers: { 'Content-Type': 'image/png' } })
}

export default getQuoteCard
