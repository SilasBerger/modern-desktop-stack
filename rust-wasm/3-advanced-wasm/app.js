// Instantiate a given WASM module and pass it to the callback.
const instantiateModuleAndRun =  async (filename, importObject, callback) => {
  let wasm;
  try {
    const fetchResponse = await fetch(`${filename}`);
    const arrayBuffer = await fetchResponse.arrayBuffer();
    wasm = await WebAssembly.instantiate(arrayBuffer, importObject);
  } catch (e) {
    console.error(e);
    return;
  }
  callback(wasm.instance.exports);
};

// Helper for setting the topic name on the HTML page.
const setTopicName = name => document.getElementById("topic-name").innerHTML = `${name}`;

// ============================ TOPICS ===============================

// === Topic: Calling JavaScript functions ===
const callJavaScriptFunctions = () => {
  setTopicName("Calling JavaScript functions");

  // Define a 2-level namespaced object of functions which the native
  // module can call.
  const importObject = {
    output: {
      log: msg => console.log(msg),
      warn: msg => console.warn(msg),
      error: msg => console.error(msg),
      alert: msg => alert(msg)
    }
  };

  instantiateModuleAndRun("call_js_functions.wasm", importObject, main);

  function main(native) {
    native.main();
  }
}

// === Topic: Shared globals ===
const sharedGlobals = () => {
  setTopicName("Shared globals");

  // Define a new shared global and make it available through the importObject.
  // Note that WASM and JS need to "agree" on the mutability of a global. If WASM
  // declares a global as mutable but JS doesn't, there will be an error during
  // instantiation. If JS declares it as mutable and WASM tries to mutate it,
  // then WASM also needs to declare it mutable in the import.
  const mutable = new WebAssembly.Global({value: "i32", mutable: true}, 0);
  const immutable = new WebAssembly.Global({value: "i32", mutable: false}, 1234);
  const importObject = {
    globals: {
      mutable,
      immutable
    }
  };

  instantiateModuleAndRun("shared_globals.wasm", importObject, main);

  function main(native) {
    console.log(`Before calling native function: mut=${mutable.value}, immut=${immutable.value}`);
    native.main();
    console.log(`After calling native function: mut=${mutable.value}, immut=${immutable.value}`);
  }
}

// === Topic: Writing to shared memory ===
function writeToSharedMemory() {
  // Create a WASM memory with an initial size of 1 page (1 page = 64KB)
  const mem = new WebAssembly.Memory({initial: 1});

  const decodeText = (offset, size) => {
    // Read memory segment identified by offset/size as Uint8Array.
    const bytes = new Uint8Array(mem.buffer, offset, size);
    // Decode bytes as UTF-8 text.
    return new TextDecoder("utf8").decode(bytes);
  }

  const importObject = {
    js: {
      // The memory object.
      mem: mem
    },
    console: {
      // Logging functions take an offset/length to identify the memory location of the message.
      log: (offset, length) => console.log(`From WASM: ${decodeText(offset, length)}`),
      bytes: (offset, length) => console.log(new Uint8Array(mem.buffer, offset, length))
    }
  };

  instantiateModuleAndRun("write_to_memory.wasm", importObject, main);

  function main(native) {
    native.main();
  }
}
// ========================== / TOPICS ==============================


// Run a topic.
writeToSharedMemory();