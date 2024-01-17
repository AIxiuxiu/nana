# 埋点实用

## 配置文件 track.config

1. getBaseInfo 基本埋点信息，可进行修改或添加

2. getTrackConfig 获取埋点配置信息函数,新增埋点需在这添加

3. getLiftTime 过期时间，默认 48 小时

4. uploadTracks 轮询上传埋点信息回调函数

5. customActionFn 自定义埋点事件 与 action 对应

## 基本用法

**v-track 自带的埋点类型有 4 种：**

支持字段
eventResource
elementId
parentElId

```
// click 点击事件 action="click"
<div v-track="{ id: 'moduleName_xxx_click', eventResource: '{xxid: 12}' }, elementId: 'demo', parentElId:''">...</div>
```

注：因为 vue 自定义 bind.value 不是响应式的，但你的 eventResource 是响应式数据时，需要像上面的 show 一样新增一个 data-track，用来替换 eventResource


## 手动埋点

import { manualBurying } from '@/track/trackUtil';

function clickHandler() {
// manualBurying 接收两个入参 埋点信息 另一个 localstorage 的 key（可选，默认 appId）
const trackInfo = { //... }
manualBurying(trackInfo)
}
