import { wasmSourceMap } from './wasm-sourcemap.ts'

export async function wasmImport(url: string, src: string) {
  let mod: WebAssembly.Module

  // @ts-ignore
  if (import.meta.env && import.meta.env.MODE !== 'production') {
    const hex = (await import(/* @vite-ignore */ `${src}.wasm?raw-hex`)).default
    const fromHexString = (hexString: string) => Uint8Array.from(
      hexString.match(/.{1,2}/g)!.map(byte =>
        parseInt(byte, 16)
      )
    )
    const wasmMapUrl = new URL(`${src}.wasm.map`, location.origin).href
    const uint8 = fromHexString(hex)
    const buffer = wasmSourceMap.setSourceMapURL(uint8.buffer, wasmMapUrl)
    const binary = new Uint8Array(buffer)
    mod = await WebAssembly.compile(binary)
  }
  else {
    mod = await WebAssembly.compileStreaming(fetch(new URL(url, location.href)))
  }

  return mod
}

