import { type FC } from 'hono/jsx'

namespace QuoteCard {
	export interface ComponentProps {
		quote: string
		author: string
	}

	export interface Theme {
		name: string
		component: FC<ComponentProps>
	}
}

export default QuoteCard
