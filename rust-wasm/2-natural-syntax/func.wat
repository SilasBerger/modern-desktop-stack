(module
  (func $const (result i32)
    i32.const 42)
  (func $sub (param $lhs i32) (param $rhs i32) (result i32)
    local.get $lhs
    local.get $rhs
    i32.sub)
  (func $calc (param $x i32) (param $y i32) (result i32)
    call $const
    local.get $x
    local.get $y
    call $sub
    call $sub)
  (export "calc" (func $calc)))