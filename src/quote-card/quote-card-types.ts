import { type NodeImageResponse } from '@vercel/og'
import { type FC } from 'hono/jsx'

type ImageOptions = ConstructorParameters<NodeImageResponse>[1]

namespace QuoteCard {
	export interface ComponentProps {
		quote: string
		author: string
	}

	type FontOptions = Exclude<Required<ImageOptions>, undefined>['fonts']

	export interface Theme {
		name: string
		fonts: () => Promise<FontOptions>
		component: FC<ComponentProps>
	}
}

export default QuoteCard
