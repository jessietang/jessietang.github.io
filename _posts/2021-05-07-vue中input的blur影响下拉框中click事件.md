---
layout: post
title: vue中input的blur影响下拉框中click事件
date: 2021-05-07
tags: "#vue， #input, #blur, #click"
categories: ["零散的知识点积累", "Vue"]
---

### 问题描述:

存在如下一段代码：

```
<input ref="input" class="search-box" placeholder="请输入要搜索的内容" v-model="keyWords" @input="search()" @focus="focusSearch()" @blur="onBlur()"/>

<div class="result-list" v-if="showComplete">
    <div class="result-item" v-if="searchResultList.length === 0">没有找到对应内容</div>
    <div class="result-item" v-for="r in searchResultList" :key="r.id" @click="toSearch([r])">{{r.name}}</div>
</div>

onBlur(){
    console.log('blur')
    this.showComplete = false
}
toSearch(nodes){
    console.log('click')
    // do sth...
    this.$nextTick(()=>{
        this.keyWords = '';
    })
}
```

输入框输入关键字搜索，选择下拉框里匹配的某一条数据后，click 无法执行。主要原因是。blur 的优先级比 click 高，先触发了 blur 事件 showComplete = false,下拉列表注销，click 无法执行。

### 解决办法

1. 解决办法一：blur 执行的函数可以加个定时器，在 200ms 后执行

```
onBlur(){
      console.log('blur')
      setTimeout(()=>{
        this.showComplete = false
      },200)
},
```

2. 解决办法二：将 click 换成优先级更高的 mousedown，将优先于 blur 执行

```
<div class="result-item" v-for="r in searchResultList" :key="r.id" @mousedown="toSearch([r])">{{r.name}}</div>
```
