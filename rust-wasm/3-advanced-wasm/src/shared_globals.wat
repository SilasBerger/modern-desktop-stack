(module 
  ;; Get the shared globals from the importObject, make them available here.
  ;; Mutable globals explicitly need to be declared as mutable here. If we
  ;; don't declare them as mutable but try to mutate it anyway, we will get an
  ;; assembler error. If we declare them as mutable here but get passed an
  ;; immutable global in the importObject, JS will give an error during 
  ;; instantiation.
  (global $g_mut (import "globals" "mutable") (mut i32))
  (global $g_immut (import "globals" "immutable") i32)
  (func
    (export "main")
    (global.set $g_mut (global.get $g_immut))))