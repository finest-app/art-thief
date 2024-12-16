import { type FC } from 'hono/jsx'
import { type SatoriOptions } from 'satori'

namespace QuoteCard {
	export interface ComponentProps {
		quote: string
		author: string
	}

	type FontOptions = SatoriOptions['fonts']

	export interface Theme {
		name: string
		fonts: () => Promise<FontOptions>
		component: FC<ComponentProps>
	}
}

export default QuoteCard
