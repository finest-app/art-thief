import { type z } from '@hono/zod-openapi'
import { parseHTML } from 'linkedom'
import invariant from 'tiny-invariant'
import type ArtWorkInfoQuerySchema from './schemes/artwork-info-query-schema'
import artworkInfoSchema from './schemes/artwork-info-schema'

const getArtworkInfo = async ({
	url,
}: z.infer<typeof ArtWorkInfoQuerySchema>) => {
	const html = await fetch(url).then((response) => response.text())

	const { document } = parseHTML(html)

	const script = document.querySelector('script[type="application/ld+json"]')

	invariant(script && script.textContent, 'No JSON-LD script found')

	const json = JSON.parse(script.textContent)

	invariant(Array.isArray(json), 'JSON-LD script is not an array')

	const artworkInfo = artworkInfoSchema.parse(json[0])

	invariant(artworkInfo, 'No artwork found')

	return artworkInfo
}

export default getArtworkInfo
