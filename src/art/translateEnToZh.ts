type TranslateResponse = [[[string, string, null, null][]], null, string]

const translateEnToZh = async (description: string) => {
	const url = new URL('https://translate.googleapis.com/translate_a/single')

	url.searchParams.append('client', 'gtx')
	url.searchParams.append('sl', 'en')
	url.searchParams.append('tl', 'zh-CN')
	url.searchParams.append('dt', 't')
	url.searchParams.append('q', description)

	const json: TranslateResponse = await fetch(url).then((response) =>
		response.json(),
	)

	return json[0]
		.map((part) => part[0])
		.filter(Boolean)
		.join('')
}

export default translateEnToZh
