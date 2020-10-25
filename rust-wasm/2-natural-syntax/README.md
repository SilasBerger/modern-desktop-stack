# More Natural WAT Syntax
Let's look at the following example ([func.wat](func.wat)):
```wat
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
```

It defines three functios: `$const`, `$sub` and `$calc`, and exports only the `$calc` function. The `$const` function returns a constant `i32` value of 42, the `$sub` function does the same thing as the `i32.sub` primitive. 

The `$calc` function is a little more complex: It takes two arguments, `$x` and `$y`. Semantically, it calculates `42 - ($x - $y)`, where the `42` comes from a call to the `$const` function and `x - y` is calculated using the `$sub` function. On a primitive instruction level, it first calls the `$const` function, which puts a `42` on the stack. Next, it puts the values of `$x` and `$y` on the stack using `local.get`. After that, it calls the `$sub` function, which pops the top two values (`$y` and `$x`, in that order), subtracts the second from the first (i.e. `$x - $y`) and puts the result on the stack. Finally the `$calc` function makes another call to `$sub`, which again pops two values. This time, the first value is the result of the previous calculation (`$x - $y`) and the second is the `42` from the `$const` function it pushed in the beginning. It again calculates "second - first" and puts the result onto the stack. The stack now has a single value on it, which is the result of calculating `42 - ($x - $y)`. That value is then implicitly returned from the `$calc` function.

This syntax very closely represents the stack-machine nature of the WebAssembly runtime. However, it is quite different from how we usually write code in high-level languages such as Rust or JavaScript. Luckily, we can use parentheses to write WAT in a more natural way. The following example ([func_refactored.wat](func_refactored.wat)) is functionally equivalent to the previous one:

```wat
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
```

If we, for instance, look at the `$sub` function, we can already see how this is closer to a modern high-level language: Rather than putting two values onto the stack and then calling the `i32.sub` primitive, we instead call the `i32.sub` primitive and "pass" two arguments `(local.get $lhs)` and `(local.get $rhs)`.

Note that this isn't actually a different syntax. Instead, the parentheses simply affect the order in which the mnemonics are translated to their corresponsing opcodes. Let's look at the body of the `$calc` function again, with some line numbers added in:

```
1  (call $sub
2    (call $const) 
3    (call $sub
4      (local.get $x) (local.get $y)))))
```

The assembler needs to resolve parentheses from the inside out. It starts on line 1 and enters the parentheses there. It won't push the `call $sub` yet, because there may be inner parentheses which need to be resolved first. Indeed, it finds such as case on line 2. Clearly, the `(call $const)` block isn't nested any further, so it can be pushed. The first instruction, therefore, is `call $const`. Next, it sees another nested instruction on line 3. This could still be nested further, so the `call $sub` isn't pushed yet. On line 4 then, it sees two more instructions which aren't nested any further. So, it pushes the `local.get $x` and `local.get $y`. It can now go one nesting level up. The next thing it gets to push is the `call $sub` on line 3. Finally, it arrives back at the top level and pushes the `$call sub` on line 1. Hence, the order in which the function body instructions are translated to their respective opcodes is

```wat
call $const
local.get $x
local.get $y
call $sub
call $sub
```

This is exactly the set of instructions we had in our first example, before we tried using a more "function-like" approach. It is therefore not surprising that, in fact, these two examples are not only functionally equivalent, but they actually produce the exact same binary. If we disassemble either of their results, we get the following WAT back:

```wat
(module
  (type (;0;) (func (result i32)))
  (type (;1;) (func (param i32 i32) (result i32)))
  (func (;0;) (type 0) (result i32)
    i32.const 42)
  (func (;1;) (type 1) (param i32 i32) (result i32)
    local.get 0
    local.get 1
    i32.sub)
  (func (;2;) (type 1) (param i32 i32) (result i32)
    call 0
    local.get 0
    local.get 1
    call 1
    call 1)
  (export "calc" (func 2)))
  ```

Another minor difference is that we specified our exports in-line in `$calc` function by adding a `(export "calc")` node to the function node, rather than adding a separate `(export "calc" (func $calc))` node at the end. This, again, was "factored out" by the assembler into what we would have written in the more "traditional" stacks-style.