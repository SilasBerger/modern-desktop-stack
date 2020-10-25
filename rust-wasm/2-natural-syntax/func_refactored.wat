(module
  (func $const
    (result i32)
    (i32.const 42))
  (func $sub
    (param $lhs i32) (param $rhs i32)
    (result i32)
    (i32.sub 
      (local.get $lhs) 
      (local.get $rhs)))
  (func $calc
    (export "calc")
    (param $x i32) (param $y i32)
    (result i32)
    (call $sub
      (call $const) 
      (call $sub
        (local.get $x) (local.get $y)))))