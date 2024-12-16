import type QuoteCard from '../quote-card-types'

const paperTheme: QuoteCard.Theme = {
	name: 'Paper',
	component: ({ quote, author }) => (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				width: '100%',
				height: '100%',
				backgroundColor: '#f8f9fa',
				padding: 20,
			}}
		>
			<p style={{ fontSize: 72 }}>”</p>
			<p
				style={{
					fontSize: 24,
					textWrap: 'balance',
				}}
			>
				{quote}
			</p>
			<p style={{ fontSize: 18, color: '#6c757d' }}>— {author}</p>
		</div>
	),
}

export default paperTheme
