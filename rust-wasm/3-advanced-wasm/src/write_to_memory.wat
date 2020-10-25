(module
  ;; Import the logging functions (note the special signature).
  (import "console" "log" (func $log (param i32 i32)))
  (import "console" "bytes" (func $bytes (param i32 i32)))

  ;; Import the memory (the "1" denotes a required initial size of
  ;; at least 1 page).
  (import "js" "mem" (memory 1))

  ;; Define 13 bytes of data at offset 0.
  (data (i32.const 0) "Hello, world!")

  ;; Define 27 bytes of data at offset 13.
  (data (i32.const 13) "This is the second message!")

  ;; Define 18 bytes of data at offset 40.
  (data (i32.const 40) "Here's one more ;)")

  (func
    (export "main")
    ;; Call the log function with offset 0 and length 13 (first message).
    (call $log (i32.const 0) (i32.const 13))
    ;; Call the log function with offset 13 and length 27 (second message).
    (call $log (i32.const 13) (i32.const 27))
    ;; Call the log function with offset 40 and length 18 (third message).
    (call $log (i32.const 40) (i32.const 18))
    ;; Call the log function with offset 3 and length 20. This will access
    ;; a memory location somewhere across the first and second message. The
    ;; output won't make much sense, but it will be readable, since those
    ;; locations contain valid UTF-8 bytes.
    (call $log (i32.const 3) (i32.const 20))
    ;; Call the log function with offset 50 and length 20. This will access
    ;; a memory location that goes over the last message, into un-initialized
    ;; memory. This will not cause an error, but the output will be garbled,
    ;; so we're also calling a function which prints the same memory location
    ;; as raw bytes. This shows that the non-initialized memory is all zeroes.
    (call $log (i32.const 50) (i32.const 20))
    (call $bytes (i32.const 50) (i32.const 20))))