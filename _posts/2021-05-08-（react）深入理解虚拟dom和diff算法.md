---
layout: post
title: （react）深入理解虚拟dom和diff算法
date: 2021-05-08
tags: "#react, #react virtual dom, #react diff算法"
categories: ["React"]
---

### 什么是虚拟 dom?

虚拟 dom 就是一个 js 对象。用 js 对象表示 DOM 信息和结构，当状态变更的时候，重新渲染这个 js 对象结构。这个 js 对象被称为 virtual dom.

### 为什么要用虚拟 dom？

早先的时候，我们都是直接操作 dom（如：jquery）.

这里，我们创建一个简单的 div，然后把他的所有的属性都打印出来：

```
    var div = document.createElement('div'),
        str = '';
    for (var key in div) {
      str = str + ' ' + key;
    }
    console.log(str);
```

打印出来的结果：
![divAttr.png](/assets/images/210509/divAttr.png)
可以看到，这些属性还是非常惊人的，包括样式的修饰特性、一般的特性、方法等等，如果我们打印出其长度，可以得到惊人的 227 个。
而这仅仅是一层，真正的 DOM 元素是非常庞大的，这是因为标准就是这么设计的，而且操作他们的时候你要小心翼翼，轻微的触碰就有可能导致页面发生重排，这是杀死性能的罪魁祸首。

而相对于 DOM 对象，原生的 JavaScript 对象处理起来更快，而且更简单，DOM 树上的结构信息我们都可以使用 JavaScript 对象很容易的表示出来。

```
var element = {
      tagName: 'ul',
      props: {
        id: 'list'
      },
      children: {
        {
          tagName: 'li',
          props: {
            class: 'item'
          },
          children: ['Item1']
        },
        {
          tagName: 'li',
          props: {
            class: 'item'
          },
          children: ['Item1']
        },
        {
          tagName: 'li',
          props: {
            class: 'item'
          },
          children: ['Item1']
        }
      }
    }
```

### 在哪里用到了虚拟 dom?

这就回到我们今天要说的。react 里面使用了虚拟 dom. React 里面就是把 jsx 转换成 js 对象。

1. jsx ?

   - jsx 是一个语法糖，React 使用 jsx 来代替常规的 Javascript.
     先看看使用 jsx 的代码：
     ![jsx01.png](/assets/images/210509/jsx01.png)

   - 再看看不使用 jsx 的代码：
     ![jsx02.png](/assets/images/210509/jsx02.png)

     react 里面使用 jsx 语法描述视图，通过 babel-loader 转译后它们变为 React.reateElement(...)形式。该函数将生成 vdom（虚拟 dom,即：js 对象）来描述真实 dom。如果状态发生变化，vdom 将作出相应的变化，再通过 diff 算法对比新老 vdom 区别从而作出最终 dom 的操作。
     访问[在线 babel 编辑器](https://www.babeljs.cn/repl#?browsers=defaults%2C%20not%20ie%2011%2C%20not%20ie_mob%2011&build=&builtIns=false&corejs=3.6&spec=false&loose=false&code_lz=MYewdgzgLgBFCWUA2BTGBeGAeAFgRhmCQEMIIA5YgWxXQCIFkU6A-ACRSSRABoYB3EACckAEwCEWAPT4WAbiA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=env%2Creact%2Cstage-2&prettier=false&targets=&version=7.14.1&externalPlugins=)试一试。

     如图示例：
     ![babel.png](/assets/images/210509/babel.png)

2. 注意：
   在 react17 之前，使用的是 React.createElement()进行 jsx 编译。
   React17 中的 jsx 转换不会将 jsx 转换为 React.createElement(...),而是自动从 react 的 package 中引入新的函数并调用。另外，此次升级，不会改变 jsx 语法，旧的 jsx 转换也将继续工作。

### diff 算法

参考：https://juejin.cn/post/6844904165026562056

1.  diff 算法是什么？
    diff 算法会比较前后虚拟 DOM，从而得到 patches(补丁)，然后与老 Virtual DOM 进行对比，将其应用在需要更新的地方，得到新的 Virtual DOM，在网上有一张非常直观的图可以帮忙参考
    ![domDiff.png](/assets/images/210509/domDiff.png)
    来解释下这张图：现有一个真实的 DOM，首先会映射为虚拟 DOM，这个时候，我们删除了最后一个 p 节点和 son2 的节点，得到了新的一个虚拟 DOM，新的 vdom 会和旧的 vdom 进行差异对比，得到了 pathes 对象，之后，对旧的真实 dom 进行操作，得到了新的 DOM。

2.  diff 策略

    - Web UI 中 DOM 节点跨层级的移动操作特别少，可以忽略不计。

    - 拥有相同类的两个组件将会生成相似的树形结构，拥有不同类的两个组件将会生成不同的树形结构。

    - 对于同一层级的一组子节点，它们可以通过唯一 id 进行区分。

3.  基于以上三个策略，React 分别对 tree diff、component diff 以及 element diff 进行了算法优化。

    - tree diff
      基于第一个策略，react 只会对同一层次的节点进行比较，当发现节点不存在时，就会删除整个节点及其子节点，不会再进行比较，这样就只需要遍历一次，就能完成对整个 DOM 树的比较。
      如果出现了 DOM 节点的跨层级的移动操作，React diff 会怎样呢？React 只会简单的考虑同层级节点的位置变换，对于不同层级的节点，只有创建和删除操作。

    - component diff
      React 对于组件间的比较采取的策略也是简洁高效。
      如果是同一类型的组件，按照原策略继续比较虚拟 dom 树；
      如果不是，则将该组件判断为 dirty component，从而替换整个组件下的所有子节点；
      对于同一类型的组件，有可能其 Virtual DOM 没有任何变化，如果能够确切的知道这点那可以节省大量的 diff 运算的时间，因此 React 允许用户通过 shouldComponentUpdate()判断该组件是否需要进行 diff。

    - element diff
      当节点处于同一层级时，React diff 提供了三种节点操作：插入、移动和删除。
      插入：新的 component 类型不在老集合里 -> 全新的节点，需要对新节点执行插入操作；
      移动：在老集合里有新 component 类型，且 element 是可更新的类型，generateComponentChildren 已调用 receiveComponent，这种情况下 prevChild=nextChild，就需要做移动操作，可以复用以前的 dom 节点；
      删除：老的 component 类型，在新集合中也有，但对应的 element 不同则不能直接复用和更新，需要执行删除操作，或者老 component 不在新集合里，也需要执行删除操作。

    - 总结：
      基于 diff 这样的策略，所以 react 建议我们用添加唯一 key 的方式来进行优化。
