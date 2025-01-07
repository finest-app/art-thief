import { type Node } from '../indigo-otter'

namespace QuoteCard {
	export interface ComponentProps {
		quote: string
		author: string
		width: number
	}

	export interface Theme {
		name: string
		component: (props: ComponentProps) =>Promise<Node>
	}
}

export default QuoteCard
