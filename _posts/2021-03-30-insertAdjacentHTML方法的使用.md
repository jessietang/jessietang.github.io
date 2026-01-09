---
layout: post
title: insertAdjacentHTML方法的使用
date: 2021-03-30
tags: "#insertAdjacentHTML, #insertAdjacentText"
categories: ["零散的知识点积累"]
---

前言：我们常用 innerText & innerHTML 给一个 dom 元素插入一段文本或者 html。最近发现还有 insertAdjacentHTML 和 insertAdjacentText 方法，这两个方法更灵活，可以在指定的地方插入 html 内容和文本内容。（adjacent，这个单词是“相邻”的意思）

### 方法使用

- insertAdjacentHTML(swhere, stext)

  - swhere: 指定插入 html 标签语句的地方，有四个值可选：
    - beforeBegin:插入到标签开始标记前， 如：xxx<div>
    - afterBegin:插入到标签开始标记后，如：<div>xxx
    - beforeEnd:插入到标签结束标记前，如：xxx</div>
    - afterEnd:插入到标签结束标记后, 如：</div>xxx
  - stext: 要插入的内容

- insertAdjacentText(swhere, stext)方法与 inserAdjacentHTML 方法类似，只不过只能插入纯文本，参数一样。
