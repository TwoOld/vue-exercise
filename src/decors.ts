// // 类装饰器
// function isFoo(target: any) {
//   console.log('isFoo',arguments)
//   // target是构造函数Foo
//   console.log(target === Foo) // true
//   target.isFoo = true
//   return target
// }
// // 属性装饰器
// function mua(target: any, name: any) {
//   console.log('mua',arguments)
//   // target是原型，name是属性名
//   console.log(target === Foo.prototype)
//   target[name] = 'mua~~~'
// }
// // 方法装饰器
// function dong(target: any, name: any, descriptor: any) {
//   console.log('dong',arguments)
//   // target是原型，name是方法名，descriptor是描述符，
//   console.log(target === Foo.prototype)
//   // 方法的定义方式：Object.defineProperty(target, name, descriptor)
//   console.log(target[name] === descriptor.value)
//   // 这里通过修改descriptor.value扩展了bar方法
//   // Object.defineProperty(target, name, {
//   //     get(){},
//   //     set(){},
//   //     configurable:true,
//   //     enumerable:true,
//   //     writable:true,
//   //     value:function(){}
//   // })
//   const bar = descriptor.value
//   descriptor.value = function() {
//     console.log('dong~')
//     bar()
//   }
//   return descriptor
// }
// @isFoo
// class Foo {
//   @mua aaa!: string
//   constructor() {
//     console.log('Foo构造函数')
//   }
//   @dong
//   bar() {
//     console.log('bar~')
//   }
// }

// console.log(Foo.isFoo) // true
// const f = new Foo()
// console.log(f.aaa) // mua~~
// f.bar()
