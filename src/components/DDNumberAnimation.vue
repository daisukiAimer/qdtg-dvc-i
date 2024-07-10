<template>

  <n-modal v-model:show="modalVisible" :mask-closable="false">
    <n-card
        style="width: 600px"
        size="huge"
        role="dialog"
        aria-modal="true"
        class="model"
    >
      <template #header>
        <div style="color: white; text-align: center; letter-spacing: 16px; line-height: 30px; font-family: SourceHanSansSC;
          font-weight: 400;
          font-size: 20px;
          padding-left: 18px;"
        >
        Partition backup
        </div>
      </template>

      <div style="display: flex; justify-content: center; flex-direction: column; align-items: center">
        <div>
          <n-number-animation
              ref="numberAnimationInstRef"
              show-separator
              :from="numberAnimationFrom"
              :to="numberAnimationTo"
              :active="true"
              duration="500"
          /> byte
        </div>
        <div>
          <n-progress type="circle" :percentage="percentage"/>
        </div>

        <div>
          <span style="font-variant-numeric: tabular-nums; white-space: nowrap">
            <n-countdown :duration="countdown" :active="countdownActive" :precision="3" :render="countdownRender"/>
          </span>
        </div>
      </div>

      <template #footer>
        <div style="display: flex; justify-content: center; column-gap: 200px">
<!--          <n-button color="rgb(99, 137, 155)" @click="false">取消</n-button>-->
<!--          <n-button color="rgb(99, 137, 155)" @click="">确定</n-button>-->

<!--          <n-button color="rgb(99, 137, 155)" v-show="finished" @click="modalVisible = false">完成</n-button>-->
          <n-button color="rgb(99, 137, 155)" v-show="finished" @click="finish">complete</n-button>
        </div>
      </template>
    </n-card>
  </n-modal>

</template>

<script setup>
import {ref, onMounted, onDeactivated, onUnmounted, inject} from "vue"

const numberAnimationInstRef = ref(null)
const numberAnimationFrom = ref(0)
const numberAnimationTo = ref(0)
const percentage = ref()
const modalVisible = ref(true)
const finished = ref(false)
let progress = '0'

const ddNumberAnimation= inject('ddNumberAnimation')

window.electronAPI.dd(ddNumberAnimation.diskPartition, ddNumberAnimation.outDir, data => {
  for (const v of data) {
    if (v === 13) {
      numberAnimationFrom.value = numberAnimationTo.value
      numberAnimationTo.value = parseInt(progress)
      percentage.value = progress.split(' ')[1].replace('%', '')
      progress = ''
    } else if (v === 44) {
    } else {
      progress += String.fromCharCode(v)
    }
  }
}, error => {

}, close => {
  numberAnimationFrom.value = numberAnimationTo.value
  numberAnimationTo.value = parseInt(progress)
  // percentage.value = progress.split(' ')[1]
  percentage.value = progress.split(' ')[1].replace('%', '')
  progress = ''
  finished.value = true

  countdownActive.value = false
})
const startDD = () => {
  // window.electronAPI.dd(ddNumberAnimation.diskPartition, ddNumberAnimation.outDir, data => {

}


const finish = () => {
  ddNumberAnimation.unmount()
}


const h = 24
const m = 60
const s = 60

const countdown = 1000 * s * m * h
const countdownActive = ref(true)

const countdownRender = ({
                           hours,
                           minutes,
                           seconds,
                           milliseconds
                         }) => {

  return `${String(h - hours - 1).padStart(2, '0')}:${String(
        m - minutes - 1
    ).padStart(2, '0')}:${String(s - seconds).padStart(2, '0')}.${String(1000 - milliseconds).padStart(3, '0')}`
}


</script>

<style scoped>
.model {
  color: white;
  background: linear-gradient(180deg, rgba(128,194,213,1) 0%, rgba(130,201,219,0.92) 13%, rgba(55,65,86,1) 96%);
}
</style>