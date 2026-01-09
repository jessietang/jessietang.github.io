---
layout: post
title: vue computed 属性为什么能够在依赖改变的时候，自己发生变化
date: 2021-04-12
tags: "#vue, #computed属性"
categories: ["Vue"]
---

### Vue computed 属性为什么能够在依赖改变的时候，自己发生变化？

![1.png](/assets/images/0412/1.png)
computed 和 watch 公用一个 Watcher 类，在 computed 的情况下有一个 deps 。 Vue 在二次收集依赖时用 cleanupDeps 在每次添加完新的订阅，会移除掉旧的订阅。

### 收集依赖

1. initState 时，对 computed 属性初始化时，触发 computed Watcher 依赖收集
2. initState 时，对 watch 属性初始化时，触发 user Watcher 依赖收集
3. render()的过程，触发 render watcher 依赖收集
4. re-render 时，vm.render()再次执行，会移除 subs 的订阅，重新赋值

查看['收集依赖'](https://zhuanlan.zhihu.com/p/45081605)更详细的解释。
