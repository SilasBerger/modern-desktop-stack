# Advanced WASM
The `src` directory contains a set of WASM files which show some more advanced concepts such as calling into JavaScript, using globals, or using memory. The `app.js` file has a set of "topic" functions, which use one or more WASM files to demonstrate the JavaScript-side of that particular topic. Call one of these functions on the last line of `app.js` to run that topic in `index.html`. Make sure to assemble the corresponding WAT file(s) first by running `wat2wasm -o <filename>.wasm src/<filename>.wat`.

## Questions
- How can we read from memory in WASM?
- How can we write to memory in a funciton (i.e. outside the data section)?
- Can we overwrite memroy from either sides?
- What happens if either side tries to access a location outside the allocated memory?
- How can we let the memory grow?
- Can we have module-globals which don't come from JS (i.e. for keeping track of memory locations?)
- What are tables and when / how do we use them (next chapter in the tutorial)?