interface ColorPalette {
	hex: string
	rgb: string
	rgba: string
	hsl: string
}

const getImageColors = async (blob: Blob) => {
	const formData = new FormData()

	formData.append('file', blob)

	const response = await fetch('https://splashy.microlink.io/api', {
		method: 'POST',
		body: formData,
	})

	const colors: ColorPalette[] = await response.json()

	return colors
}

export default getImageColors
