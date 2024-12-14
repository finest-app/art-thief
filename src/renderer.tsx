import { jsxRenderer } from 'hono/jsx-renderer'

const renderer = jsxRenderer(({ children }) => {
	return (
		<html>
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>minimalist</title>
				<link rel="icon" type="image/png" href="/favicon.png" />
				<link href="/static/style.css" rel="stylesheet" />
			</head>
			<body>{children}</body>
		</html>
	)
})

export default renderer
