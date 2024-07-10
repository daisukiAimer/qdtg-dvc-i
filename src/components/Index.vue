<template>
<!--  <h1>Hello World!</h1>
  We are using Node.js <span id="node-version"></span>,
  Chromium <span id="chrome-version"></span>,
  and Electron <span id="electron-version"></span>.-->

<!--  <div>
    <n-button @click="openFileDialog()">选择文件夹</n-button>
  </div>

&lt;!&ndash;  <img src="item:///E:/幻灯片/5382468855ca3e93f0baba468.jpg">&ndash;&gt;
&lt;!&ndash;  <img v-for="(file, index) in state.resources.files" :src="`item:///${state.resources.path}/${file}`">&ndash;&gt;
  <template v-for="(file, index) in state.resources">
&lt;!&ndash;    <img style="width: 100px" v-if="index < 3" :src="`item:///${state.resources.path}/${file}`">&ndash;&gt;
    <img style="width: 100px" v-if="index < 3" :src="`item:///${encodeURI(file)}`">
  </template>-->

  <div style="display: flex;">
    <img src="../assets/index/图片@1x.png" height="572" width="572"/>
    <div>欢迎使用效哥行车记录仪提取固证系统</div>
    <div>点击下方按钮开始全面扫描您的TF卡</div>
    <img src="../assets/index/群组@1x.png" height="123" width="118"/>
  </div>


</template>

<script setup>

import { reactive } from "vue"

const state = reactive({
  resources: []
})

console.log(window)

const openFileDialog = async () => {
  const res = await window.electronAPI.openFileDialog()
  state.resources = res
}
</script>

<style scoped>

</style>