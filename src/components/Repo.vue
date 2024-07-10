<template>
  <div class="box">
    <div class="left">
      <div>
        <div>回溯完成</div>
        <div>没有找到想要的结果？点击使用深度回溯</div>
      </div>
    </div>
    <div class="line">
      <div style="width: 4px; background-color: rgba(187,187,187,1); height: 77%"></div>
    </div>
    <div class="right">
      <div class="item-box">
        <div class="item" v-for="(file, index) in resources">
          <div style="display: flex; flex-direction: column; justify-content: space-between">
            <div style="position: relative; margin-top: 50px; display: flex; align-items: center; justify-content: center;">
              <div style="display: inline-block">
                <div style="border-radius: 20px; height: 60px; background: rgb(108, 153, 172); min-width: 310px; justify-content: center;
                   padding: 0 20px; line-height: 26px; font-size: 18px; text-align: center; align-items: center; display: flex">
                  2022-11-14 09:45:06
                </div>
              </div>
              <svg class="item-left-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="25" height="25"><defs data-reactroot=""></defs><g><path d="M3 6C3 4.34315 4.34315 3 6 3H18C19.6569 3 21 4.34315 21 6V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V6Z" fill="black"></path></g></svg>
              <div class="item-left-circle"></div>
            </div>

            <div style="position: relative; margin-top: 50px; display: flex; align-items: center; justify-content: center;">
              <div style="display: inline-block">
                <div style="border-radius: 20px; height: 60px; background: rgb(108, 153, 172); min-width: 310px; justify-content: center;
                   padding: 0 20px; line-height: 26px; font-size: 18px; text-align: center; align-items: center; display: flex">
                  2022-11-14 09:45:06
                </div>
              </div>
              <svg class="item-left-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="25" height="25"><defs data-reactroot=""></defs><g><path d="M3.808 15.68c0-3.776-0.256-7.616 0.064-11.392 0.352-4.16 3.104-5.472 6.624-3.104 5.344 3.616 10.56 7.52 15.712 11.456 2.752 2.080 2.752 4.576-0.064 6.688-5.312 4-10.624 7.968-16.128 11.744-2.944 2.016-5.728 0.672-6.048-3.040-0.352-4.064-0.064-8.224-0.064-12.352h-0.096z"></path></g></svg>
              <div class="item-left-circle"></div>
            </div>
          </div>
          <div>
            <div style="background-color: rgba(7,98,253,0.92); height: 100%"></div>
          </div>
          <div class="content">
            <div>
              <svg @click="checkboxValue=!checkboxValue" v-if="checkboxValue" style="fill: rgb(255, 255, 255); cursor: pointer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="36" height="36"><defs data-reactroot=""></defs><g><path d="M16 29.333c-7.364 0-13.333-5.969-13.333-13.333s5.969-13.333 13.333-13.333 13.333 5.969 13.333 13.333-5.969 13.333-13.333 13.333zM16 26.667c5.891 0 10.667-4.776 10.667-10.667s-4.776-10.667-10.667-10.667v0c-5.891 0-10.667 4.776-10.667 10.667s4.776 10.667 10.667 10.667v0z"></path></g></svg>
              <!--                rgb(0, 215, 255);-->
              <div @click="checkboxValue=!checkboxValue" v-if="!checkboxValue" style="width: 36px; height: 36px;
                  background: rgb(0, 215, 255);
                  cursor: pointer;
                 box-sizing: border-box;
                  border: rgb(187, 187, 187) 1px solid;
                   border-radius: 50%;
                   display: flex;
                   justify-content: center;
                   align-items: center;
">
                <svg style="fill: rgb(255, 255, 255); margin: 0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <defs data-reactroot=""></defs>
                  <g>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M21.3516 4.2652C22.0336 4.73552 22.2052 5.66964 21.7348 6.35162L11.7348 20.8516C11.4765 21.2262 11.0622 21.4632 10.6084 21.4961C10.1546 21.529 9.71041 21.3541 9.40082 21.0207L2.90082 14.0207C2.33711 13.4136 2.37226 12.4645 2.97933 11.9008C3.5864 11.3371 4.53549 11.3723 5.0992 11.9793L10.3268 17.6091L19.2652 4.64842C19.7355 3.96644 20.6696 3.79487 21.3516 4.2652Z"></path>
                  </g>
                </svg>
              </div>
            </div>
            <img @click="active=true" style="width: 100px" :src="`item:///${encodeURI(file)}`">
            <div>
              <p>录制时长：3h 35min 12s</p>
              <p>录制时长：3h 35min 12s</p>
              <p>录制时长：3h 35min 12s</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <n-drawer v-model:show="active" :width="502" placement="right">
    <n-drawer-content>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup>

import { ref } from "vue";

// const resources = ref([])
const loading = ref(true)
const checkboxValue = ref(true)
const active = ref(false)

const props = defineProps({
  filePaths: [],
  resources: []
})

/*const getDirInfo = async () => {
  const res = await window.electronAPI.getDirInfo([props.filePaths[0]])
  setTimeout(() => {
    loading.value = false
  }, 1000)

  resources.value = res
}

getDirInfo()*/

</script>

<style scoped>
.box {
  height: 100vh;
  display: grid;
  grid-template-columns: 1fr 4px 2fr
}


.left {
  display: flex;
  place-items: center
}

.line {
  place-items: center;
  display: flex
}

.right {
  max-height: 100vh;
  overflow-y: scroll;
  width: 66vw;
  padding: 15px
}

.item-box {
  display: flex;
  place-items: center;
  flex-direction: column
}

.item {
  width: 100%;
  height: 400px;
  /*border: 2px darkcyan solid;*/
  display: grid;
  grid-template-columns: .45fr 4px .55fr
}

img {
  border-radius: 25px;
  margin: 0 50px 0 30px;
}

.item-left-up {
  display: flex;
  place-items: center;
}

.item-left-svg {
  position: absolute;
  right: 20px;
}

.item-left-circle {
  width: 24px;
  height: 24px;
  border: rgb(187, 187, 187) solid 1px;
  border-radius: 19px;
  background: rgb(255, 255, 255);
  display: inline-block;
  position: absolute;
  right: -15px;
}


.content {
  /*display: grid;
  grid-template-columns: 50px auto auto;
  place-items: center;*/
  margin-left: 35px;
  display: flex;
  place-items: center;
}


.backtrack{
  animation: mymove 5s infinite;
}

@keyframes mymove {
  50% {
    transform: rotate(360deg);
  }
}
</style>