---
layout: post
title: json tree形数据查找复合条件的json tree数据
date: 2021-05-07
tags: "算法"
categories: ["零散的知识点积累"]
---

### 需求描述

存在一个 json tree 形数据：

```
var treeData = [
    {
        id: 'root',
        name: '食物',
        children: [
            {
                id: '1',
                name: '水果',
                children: [
                    {
                        id: '1-1',
                        name: '水果-苹果',
                        children: []
                    },
                    {
                        id: '1-2',
                        name: '香蕉',
                        children: []
                    }
                ]
            },
            {
                id: '2',
                name: '主食',
                children: [
                    {
                        id: '2-1',
                        name: '主食-米饭',
                        children: []
                    },
                    {
                        id: '2-2',
                        name: '面条',
                        children: []
                    },
                    {
                        id: '2-3',
                        name: '米线',
                        children: []
                    }
                ]
            },
            {
                id: '3',
                name: '零食',
                children: [
                    {
                        id: '3-1',
                        name: '瓜子',
                        children: []
                    },
                    {
                        id: '3-2',
                        name: '花生',
                        children: []
                    },
                    {
                        id: '3-3',
                        name: '蚕豆',
                        children: []
                    }
                ]
            }
        ]
    }
]
```

输入框搜索关键词，如：“水果”，一旦发现某一层级的 name 匹配上了关键词，则返回这一层级以及他的所有子元素。
返回的数据应该如下：

```
var searchResult = [
    {
        id: 'root',
        name: '食物',
        children: [
            {
                id: '1',
                name: '水果',
                children: [
                    {
                        id: '1-1',
                        name: '水果-苹果',
                        children: []
                    },
                    {
                        id: '1-2',
                        name: '香蕉',
                        children: []
                    }
                ]
            }
    }
]
```

算法如下：

```
    // tree search
    handleTreeData(treeData, searchValue) {
      if (!treeData || treeData.length === 0) {
        return [];
      }
      const array = [];
      for (let i = 0; i < treeData.length; i += 1) {
        const nodeName = treeData[i].name.toLowerCase()
        const searchName = searchValue.toLowerCase()
        if (this.handleTreeData(treeData[i].children, searchValue).length > 0 || nodeName.includes(searchName)) {
          let obj = {
            ...treeData[i]
          }
          if(!nodeName.includes(searchName)){
            // 父节点name不包含searchVal,则继续查找。否则，子节点不用查找，把父节点和父节点的children直接返回
            obj.children = this.handleTreeData(treeData[i].children, searchValue)
          }
          array.push(obj)
        }
      }
      return array;
    }
```
