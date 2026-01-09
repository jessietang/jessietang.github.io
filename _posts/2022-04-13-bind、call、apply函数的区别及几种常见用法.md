---
layout: post
title: bind、call、apply函数的区别及几种常见用法
date: 2022-04-12
tags: "#bind, #call, #apply"
categories: ["面试合集","零散的知识点积累"]
---

#### 讲区别之前，先讲一下三者的共同点：
> 1. 都是用来改变函数的this对象的指向的。
> 2. 第一个参数都是this要指向的对象。
> 3. 都可以利用后续参数传参。

#### 三者的区别：
> 1. call/apply都是对函数的直接调用。二者传参有区别。 <br/> call(this,arg1,arg2,...)  /  apply(this,[arg1,arg2,...])
> 2. bind函数返回的还是一个函数。【后面写一个bind函数的实现】<br/> bind(thisArgs, arg1, arg2, ...)

&nbsp;

#### 1. 先来说说bind函数

#### bind函数的几种常见用法：

##### 1. 偏函数。使一个函数拥有预设的初始参数。

```javascript
function add(x, y){
    console.log('x+y', x+y)
}
var add1 = add(1,2) // x+y 3

var add2 = add.bind(null,100)
add2(1,2) // x+y 100+1 = 101  第二个参数2无效
```

##### 2. 改变this指向

```javascript
// 在默认情况下，使用 window.setTimeout() 时，this 关键字会指向 window （或 global）对象。
// 当类的方法中需要 this 指向类的实例时，你可能需要显式地把 this 绑定到回调函数，就不会丢失该实例的引用。
function Test(){
    this.x = 1
}
Test.prototype.boom = function(){
    window.setTimeout(this.declare.bind(this), 1000)
}
Test.prototype.declare = function(){
    console.log(this.x, this)
}
var test = new Test()
test.boom() // 1 Test{x: 1}
```

#### 来实现一个简易的bind函数，需要注意的是，bind函数返回的还是一个函数：

```javascript
// 简易实现
Function.prototype.myBind = function(context){
    var self = this
    return function(){
        // 把当前函数(调用myBind方法的函数)的this，指向myBind的第一个参数对象的this
        self.apply(context)
    }
 }

 var obj = {x: 1}
 var fun = function(){
     console.log(this.x)
 }.myBind(obj)
 fun() // 1

```

#### bind函数复杂一点的实现：

```javascript
 // bind函数复杂一点的实现
 Function.prototype.myBind = function(){
     // 这个地方的arguments是myBind这个function的arguments
     var self = this
     var context = Array.prototype.shift.call(arguments)
     var args = [].slice.call(arguments)
     return function(){
         // 这个地方的arguments是当前return这个function的arguments
        self.apply(context, [].concat.call(args, [].slice.call(arguments)))
     }
 }

 var obj = {x: 1}
 var fun = function(m,n){
     console.log(this.x, m,n)
 }.myBind(obj,300)
 fun(100,200,1) // 1 300 100
```


#### 2. 上面的这个bind函数实现，涉及到较多关于call和apply的使用。下面来说一下这俩。

#### call和apply函数的几种常见用法：

##### 1. 改变this指向

```javascript
var person1 = {
    name: 'p1',
    age: 11,
    sayHello: function(sex){
        console.log(this.name+'今年'+this.age+'岁，性别：'+sex)
    }
}

var person2 = {
    name: 'p2',
    age: 22
}

person1.sayHello.call(person2, '女') // p2今年22岁，性别：女
```

##### 2. 借用其他对象的方法（这点经常使用，比较常见）

```javascript
 var funs = []

 const fun1 = function(){console.log('fun1')}
 const fun2 = function(){console.log('fun2')}
 const fun3 = function(){console.log('fun3')}

 funs.push(fun1)
 Array.prototype.push.apply(funs,[fun2])
 Array.prototype.push.call(funs,fun3)
 console.log(funs) // [f,f,f]

 const firstFun = [].shift.call(funs) // 把funs里面的第一个踢出来
 console.log(firstFun) // ƒ (){console.log('fun1')}

 // 输出fun2fun3
 funs.forEach(i=>{
     i && i.call && i.call() // call第一个参数不传，非严格模式下，默认指向Window对象
 })

```

再来一个示例：

```javascript
  function test(){
     console.log(arguments);
     console.log(Object.prototype.toString.call(arguments));
     var args = [].slice.call(arguments);
     console.log(args);
     console.log(Object.prototype.toString.call(args));
 }
 test(1,2,3,4)

```
上面示例输出如下：
![1.jpg](/assets/images/2204/1.jpg)

&nbsp;
再来一个项目里面常用的示例：

```javascript
  function EasyEmitter(){
    this.emit = function(key,handler){
       console.log(this.x, key)
    }
}
function MyFun(){
     this.x = 1;
     this.fun1 = function(){
         console.log(this.x)
     }
     EasyEmitter.call(this) // 调用了这个，this上面就有EasyEmitter里面的方法了，如: emit方法
     console.log(this) // MyFun{x: 1, fun1: f, emit: f}  myFun对象上，有EasyEmitter里面的方法了
     this.emit('ddd',null) // EasyEmitter里面的this，就指向MyFun对象了
 }

 let myFun = new MyFun()
 console.log(myFun) // MyFun{x: 1, fun1: f, emit: f}  myFun对象上，有EasyEmitter里面的方法了

```