import { initWasm } from '@resvg/resvg-wasm'
import wasm from '@resvg/resvg-wasm/index_bg.wasm?url'

let wasmInitialized = false

const initResvg = async () => {
	if (wasmInitialized === false) {
		await initWasm(
			import.meta.env.DEV
				? fetch('https://esm.sh/@resvg/resvg-wasm/index_bg.wasm')
				: wasm,
		)

		wasmInitialized = true
	}
}

export default initResvg
