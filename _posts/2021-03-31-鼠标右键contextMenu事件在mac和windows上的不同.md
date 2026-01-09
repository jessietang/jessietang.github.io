---
layout: post
title: 鼠标右键contextMenu事件在mac和windows上的不同
date: 2021-03-31
tags: "#鼠标右键事件, #contextMenu, #mac & windows区别"
categories: ["零散的知识点积累"]
---

前言：在做一个自定义鼠标右键菜单的需求的时候，发现 contextMenu 事件在 mac 和 windows 平台上表现不一致。

### 方法使用

- 区别

  - mac: 右键按下即触发 contextMenu event，鼠标抬起，触发 mouseUp event；
  - win: 右键按下抬起后，先触发 mouseUp event，然后触发 contextMenu event。
