let h = 'xx' //类型推论
let title: string
// name = 2
// title = 4
title = 'hello'
h = 'hi'

// 数组类型
let names: string[]
names = ['jack']

// 多种类型
let multiType: string | number
multiType = 1
multiType = 'hi'

// 任意类型
let foo: any = 'hi'
foo = 2

// 类型用于函数
function hi(person: string): string {
  return 'hello ' + person
}
function warnHi(msg: string, num?: number): void {
  alert(msg + num)
}
// 重载：通过参数或返回值类型或个数区别同名函数，先声明，再实现
// 声明1
function info(a: object): string
// 声明2
function info(a: string): object
// 实现
function info(a: any): any {
  if (typeof a === 'object') {
    return a.name
  } else {
    return { name: a }
  }
}
console.log(info({ name: 'tom' }))
console.log(info('tom'))

// class
class MyComp {
  // 访问修饰符private、public、protected
  // private _foo: string; // 私有属性，不能在类的外部访问
  // protected bar: string;// 保护属性，还可以在派生类中访问
  readonly mua = 'mua' // 只读属性必须在声明时或构造函数里初始化

  // 构造函数：初始化成员变量
  // 参数加上修饰符，能够定义并初始化一个成员属性
  constructor(
    private tua = 'tua',
    private _foo = 'foo',
    protected bar = 'bar'
  ) {
    // this._foo = foo;
    // this.bar = bar;
  }

  // 方法也有修饰符
  private someMethod() {}

  // 存取器：存取数据时可添加额外逻辑；在vue里面可以用作计算属性
  get foo() {
    return this._foo
  }
  set foo(val) {
    this._foo = val
  }
}
