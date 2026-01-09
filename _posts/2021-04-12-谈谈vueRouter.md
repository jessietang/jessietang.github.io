---
layout: post
title: 谈谈vue-router
date: 2021-04-12
tags: "#vue, #vue-router, #hash, #history"
categories: ["Vue"]
---

### vue-router 对不同模式的实现大致是这样的：

1. 首先根据 mode 来确定所选的模式，如果当前环境不支持 history 模式，会强制切换到 hash 模式；
2. 如果当前环境不是浏览器环境，会切换到 abstract 模式下。然后再根据不同模式来生成不同的 history 操作对象。

### new VueRouter 过程

1. init 方法内的 app 变量便是存储的当前的 vue 实例的 this。
2. 将 app 存入数组 apps 中。通过 this.app 判断是实例否已经被初始化。
3. 通过 history 来确定不同路由的切换动作 history.transitionTo。
4. 通过 history.listen 来注册路由变化的响应回调。

### hash 和 history 的区别

1. 最明显的是在显示上，hash 模式的 URL 中会夹杂着#号，而 history 没有。
2. Vue 底层对它们的实现方式不同。hash 模式是依靠 onhashchange 事件(监听 location.hash 的改变)，而 history 模式（popstate）是主要是依靠的 HTML5 history 中新增的两个方法，pushState()可以改变 url 地址且不会发送请求，replaceState()可以读取历史记录栈，还可以对浏览器记录进行修改。
3. 当真正需要通过 URL 向后端发送 HTTP 请求的时候，比如常见的用户手动输入 URL 后回车，或者是刷新(重启)浏览器，这时候 history 模式需要后端的支持。因为 history 模式下，前端的 URL 必须和实际向后端发送请求的 URL 一致，例如有一个 URL 是带有路径 path 的(例如www.lindaidai.wang/blogs/id)，如果后端没有对这个路径做处理的话，就会返回404错误。所以需要后端增加一个覆盖所有情况的候选资源，一般会配合前端给出的一个404页面。

### vue history 配置

vue history 需要 nginx 或者其他方式配置一下才可正确访问，否则路由跳转之后刷新一下便会出现 404。

- vue history 模式 部署在服务器端的 nginx 配置，配置如下：

1. 根路径配置：

```
server {

        listen      443 ;

        server_name  m;

        root  html/mobile;

        location / {

            index  index.html index.htm;

            try_files $uri $uri/ /index.html;

        }

    }
```

路由配置：

```
const router=new VueRouter({
  mode: 'history',
  routes
})
```

2. 非根路径配置：

```
server {
        location ^~/A {

            index  index.html

            try_files $uri $uri/ /A/index.html;

        }

        location ^~/B {

            index  index.html

            try_files $uri $uri/ /B/index.html;

        }

    }
```

路由配置：

- A 项目：

```
const router=new VueRouter({
  mode: 'history',
  routes,
  base: '/A'
})
```

- B 项目：

```
const router=new VueRouter({
  mode: 'history',
  routes,
  base: '/B'
})
```

### 缓存策略

设置某些文件不使用缓存：
location = /index.html {
add_header Cache-Control "no-cache, no-store";
}
location = /lib/sdk.js {
add_header Cache-Control "no-cache, no-store";
}
