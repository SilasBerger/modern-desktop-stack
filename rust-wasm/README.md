# Rust + WASM
## 📦 Projects
- [1-wasm-by-hand](1-wasm-by-hand): A first example of a web application using WASM, without using high-level languages or build tools.

## 📓 Study Notes
### A Note on Instantiating
In the first example, we instantiate the WASM module (roughly) as follows:

```javascript
const fetchResponse = await fetch("add.wasm");
const arrayBuffer = await fetchResponse.arrayBuffer();
WebAssembly.instantiate(arrayBuffer).then(wasmObj => {...});
```

This approach is a little cumbersome and involves a lot of `await`. For that reason, there is a more modern approach, which would look something like this:

```javascript
WebAssembly
  .instantiateStreaming(fetch("add.wasm"), importObject)
  .then(wasmObj => {...});
```

The core difference here is that we use `instantiateStreaming` instead of `instantiate`. This function accepts the `fetch` promise and an optional `importObject` which contains values to be imported into the newly-created instance (see [documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/instantiateStreaming)).

This approach is a lot cleaner and easier to work with, but it has a drawback: The `instantiateStreaming` function requires the MIME type of the `fetch` response to be `application/wasm`. However, in a lot of web servers, the default MIME type for `.wasm` files will be `application/octet-stream`, which will result in an error. So, in order to omit having to configure a web server, we have used the "old" syntax in our examples.

## 🎒 Resources
- [WASM on MDN](https://developer.mozilla.org/en-US/docs/WebAssembly)
- [WASM concepts](https://developer.mozilla.org/en-US/docs/WebAssembly/Concepts)
- [Understanding the WAT format](https://developer.mozilla.org/en-US/docs/WebAssembly/Understanding_the_text_format)
- [Converting WAT to WASM](https://developer.mozilla.org/en-US/docs/WebAssembly/Text_format_to_wasm)
- [Loading and running WASM](https://developer.mozilla.org/en-US/docs/WebAssembly/Loading_and_running)
- [WABT WASM (dis)assembler](https://github.com/WebAssembly/wabt/blob/master/README.md)

## 🙋 Questions
- In what environment does WASM run (i.e. what can it access? DOM? FS? Cookies, localStorage? document?)
- Is WASM stateful? Could I, for instance, count how many times the `add` function was called (without having to pass some state object between WASM and JS on every call)?
- If, for example, a WASM function takes an i32 argument - who is responsible for checking integer overflows?