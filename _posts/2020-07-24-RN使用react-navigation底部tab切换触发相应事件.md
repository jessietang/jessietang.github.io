---
layout: post
title: RN使用react-navigation底部tab切换触发相应事件
date: 2020-07-24
categories: ["React-Native"]
---

问题引入：
在 rn 实际开发场景中遇到很多这种需求：主页面，底部是 react-navigation 实现的底部 tab 栏。在使用应用的过程中，可进行切换。但是，在切换的时候，需要触发切换这个事件，在这个事件里面，去执行其他时间（例如：请求最新的个人信息数据、或者最新的消息数据等等）
解决这类问题，大致就是网上查阅，翻翻文档。最后把我自己实际开发中用到的两种解决方案附上，以做记录：

1. 完全使用 hook：首次进入该页面时就会触发。后面再次进入的时候，也会触发。首次进入该 screen 不需要单独请求数据。

```
import { useFocusEffect, useIsFocused } from 'react-navigation-hooks'
import React, { useCallback, useEffect, useState } from 'react'

useFocusEffect(
    useCallback(() => {
      console.log('screen takes focus')
      doRequest();

      return () => console.debug('screen loses focus')
    }, [])
)
```

2. 不使用 hook：用 didFocus 来进行监听，首次进入该页面时，不会触发。后面再进入的时候，会触发。所以这种模式，首次进入该 screen 需要单独请求数据。

```
// 首次进入需要单独请求数据
useEffect(()=>{
    console.log('第一进入触发')
    doRequest();
},[])

useEffect(() => {
    console.log('第一进入触发')
    const _navListener = props.navigation.addListener('didFocus', () => {
      console.log('后面再进入触发')
      doRequest();
    });

    return () => {
      _navListener.remove();
    };
  }, []);
```
