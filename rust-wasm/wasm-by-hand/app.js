// The first thing we need to do is fetch our WASM binary and instantiate.
// This will allow us to then use the WASM functions from JavaScript. For
// a note on WebAssembly.instantiate() vs. WebAssembly.instantiateStreaming(),
// see the study notes in the `README` for the `rust-wasm` topic.
//
// Instantiating our module will involve some async work, which is why we are 
// wrapping this process in a Promise here.
const instantiateModule =  (filename) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Fetch the WASM file.
      const fetchResponse = await fetch(filename);

      // Get the arrayBuffer from the fetch response.
      const arrayBuffer = await fetchResponse.arrayBuffer();

      // Instantiate the WASM module by passing the arrayBuffier into
      // the browser's WebAssembly.instantiate() function. Once that's
      // successful, we can resolve the promise and return the resulting
      // WASM object.
      resolve(await WebAssembly.instantiate(arrayBuffer));
    } catch(e) {
      // In case something goes wrong...
      reject(e);
    }
  });
};

// We can now use our instantiateModule function to get an instance
// of our WASM module.
instantiateModule("add.wasm").then(wasmObject => {
  // All being well, we should now have our instantiated WASM object!
  console.log("The WASM object:")
  console.log(wasmObject);

  // Trying out our "add" function by accessing it from the instance's
  // exports:
  const result = wasmObject.instance.exports.add(40, 2);
  console.log("Trying out the add function:")
  console.log(`40 + 2 = ${result}`);
}).catch(e => {
  // In case something goes wrong...
  console.error(e)
});