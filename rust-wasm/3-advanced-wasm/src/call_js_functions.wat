(module
  ;; Import functions from JavaScript. These functions need to be provided
  ;; during instantiation, as the importObject. The functions have 2-level
  ;; namespace, which is reflected in the two strings here (e.g. "output" 
  ;; "log")
  (import "output" "log" (func $log (param i32)))
  (import "output" "warn" (func $warn (param i32)))
  (import "output" "error" (func $error (param i32)))
  (import "output" "alert" (func $alert (param i32)))

  ;; Use some of the logging functions, pass an i32 for simplicity.
  (func $do_some_logging 
    (local $const i32)
    (local.set $const (i32.const 42))
    (call $log (local.get $const))
    (call $warn (local.get $const))
    (call $error (local.get $const)))

  (func $main
    (export "main")
    call $do_some_logging))