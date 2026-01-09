---
layout: post
title: findIndex(numArr, sum)用时间复杂度是o(n)的算法来实现
date: 2022-04-30
tags: "#面试, #算法"
categories: ["面试合集"]
---

#### 问题： 实现一个findIndex算法可以满足如下规律：实现索引在数组里面对应的值加起来等于第二个参数sum，时间复杂度为o(n)
```javascript
findIndex([1,2,3,4,5], 5) // [1, 2]
findIndex([1,2,5,4], 5) // [0, 3]
findIndex([1,1,1], 2) // [0,1] || [1,2] || [0,2]
```

我刚开始用for循环来实现的：
```javascript
for(let i=0; i<arr.length; i++){
    for(let j=i+1; j<arr.length){
        if(arr[i] + arr[j] == sum){
            return [i, j]
        }
    }
}
```
但是这样实现的时间复杂度为o(n^2)


实现为时间复杂度为o(n)的算法，分析如下：
```
{
    [5-1]: 3,
    [5-2]: 2,
    [5-3]: 1,
    [5-4]: 0,
    [5-5]: 4
}
```
这样只需要在外面循环一次，从一个对象里面取某个属性，时间复杂度是常数。
```javascript
function findIndex(arr, sum) {
  var obj = {};

  for (let i = 0; i < arr.length; i++) {
    if (obj.hasOwnProperty(sum - (sum - arr[i]))) {
      return [obj[(sum - (sum - arr[i]))], i];
    }

    if (!obj.hasOwnProperty(sum - arr[i])) {
      obj[sum - arr[i]] = i;
    }
  }
}
```

