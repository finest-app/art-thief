import type QuoteCard from '../quote-card-types'

const christmasTheme = {
	name: 'Christmas',
	fonts: async () => {
		const fontFileResponse = await fetch(
			'https://cdn.jsdelivr.net/fontsource/fonts/kalam@latest/latin-400-normal.ttf',
		).then((response) => response.arrayBuffer())

		return [
			{
				name: 'Kalam',
				data: fontFileResponse,
				weight: 400,
				style: 'normal',
			},
		]
	},
	component: ({ quote, author }) => (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				width: '100%',
				height: '100%',
				backgroundImage: 'linear-gradient(to bottom, #8B0000 0%, #DC143C 100%)',
			}}
		>
			<div
				style={{
					position: 'absolute',
					width: '100%',
					height: '100%',
					backgroundImage: `radial-gradient(circle, rgba(255, 255, 255, 0.5) 7%, rgba(255, 255, 255, 0) 7%),
                radial-gradient(circle, rgba(255, 255, 255, 0.3) 5%, rgba(255, 255, 255, 0) 5%),
                radial-gradient(circle, rgba(255, 255, 255, 0.4) 6%, rgba(255, 255, 255, 0) 6%)`,
					backgroundSize: '50px 50px',
					backgroundPosition: '0 0, 35px 35px, 70px 70px',
				}}
			/>
			<div
				style={{
					flex: 1,
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					padding: 20,
				}}
			>
				<p
					style={{
						fontSize: 64,
						textWrap: 'balance',
						color: 'white',
					}}
				>
					{quote}
				</p>
				<p style={{ fontSize: 28, color: 'white' }}>— {author}</p>
			</div>
		</div>
	),
} as const satisfies QuoteCard.Theme

export default christmasTheme
