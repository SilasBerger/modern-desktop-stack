// Select which WASM file should be instantiated.
const useRefactored = true;

const instantiateModule =  (filename) => {
  return new Promise(async (resolve, reject) => {
    try {
      const fetchResponse = await fetch(filename);
      const arrayBuffer = await fetchResponse.arrayBuffer();
      const wasm = WebAssembly.instantiate(arrayBuffer);
      resolve(wasm);
    } catch(e) {
      reject(e);
    }
  });
};

const filename = useRefactored ? "func_refactored.wasm" : "func.wasm";
document.getElementById("wasm-file-name").innerHTML = `${filename}`;

instantiateModule(filename).then(wasmObject => {
  main(wasmObject.instance.exports);
});

function main(native) {
  console.log(`42 - (12 - 2) = ${native.calc(12, 2)} (should be 32)`)
}