<template>
  <div class="backtrack-record-box" ref="backtrackRecordBoxRef">
    <div class="left">
      <div class="header">Operating time</div>
      <n-scrollbar @scroll="scrollCb">
        <div class="content">
          <div :class="`item ${currentRoute.currentData === data ? 'checked' : ''}` "
               @click="checkedItem(data)"
               v-for="(data, index) in currentRoute.dataList">
            {{ moment(data.operationTime).format(currentRoute.dateformat) }}
          </div>
        </div>
      </n-scrollbar>
    </div>
    <div class="right">
      <div class="header">

        <div class="l">
          <div :class="`box ${operateRecordMenuVisible ? 'active' : ''}`" @mouseleave="operateRecordMenuVisible=false">
<!--            <div class="checked-operate-record" @click="operateRecordMenuVisible = !operateRecordMenuVisible">-->
            <div class="checked-operate-record">
              <div class="val">{{ currentRoute.name === '回溯记录' ? 'Backtracking record' : 'Authentication History' }}</div>
<!--              <div class="arrow">
                <svg v-show="!operateRecordMenuVisible" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><defs data-reactroot=""></defs><g><path d="M13.1713 24.937C12.5708 24.4567 12.5708 23.5433 13.1713 23.063L30.0504 9.5597C30.8361 8.93113 32 9.49054 32 10.4967V37.5032C32 38.5095 30.8361 39.0689 30.0504 38.4403L13.1713 24.937Z"></path></g></svg>
                <svg v-show="operateRecordMenuVisible" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><defs data-reactroot=""></defs><g><path d="M24.937 34.8287C24.4567 35.4292 23.5434 35.4292 23.063 34.8287L9.55971 17.9496C8.93114 17.1639 9.49055 16 10.4968 16L37.5033 16C38.5095 16 39.0689 17.1639 38.4403 17.9496L24.937 34.8287Z"></path></g></svg>
              </div>-->
            </div>
            <div class="operate-record-menu" v-show="operateRecordMenuVisible">
              <div v-for="(route, index) in routes" v-show="currentRoute !== route" @click="changeRoute(route)">{{ route.name === '回溯记录' ? 'Backtracking record' : 'Authentication History' }}</div>
            </div>
          </div>
        </div>

        <div class="r">
          <!-- <n-button type="tertiary" color="rgb(99, 137, 155)"
                    @click="visibleRef = true"
                    v-show="currentRoute.name === '回溯记录'"
                    :disabled="!currentRoute.resList.filter(item => item.checked).length">
                    Evidence authentication
          </n-button>
          <n-button type="tertiary" color="rgb(99, 137, 155)" @click="currentRoute.exportFile" :disabled="!currentRoute.resList.filter(item => item.checked).length">
            Export
          </n-button>
          <n-checkbox class="select-all" style="--n-size: 28px" size="large" @update:checked="updateSelectAll">
            all
          </n-checkbox> -->
        </div>
      </div>
      <n-scrollbar>
        <component :is="currentRoute.component" :resources="currentRoute.resList"></component>
      </n-scrollbar>
    </div>
  </div>

  <modal v-model:visible="visibleRef" :to="backtrackRecordBoxRef" :resources="currentRoute.resList" :changeModal="changeModal"/>
  <repoModal ref="repoModalRef" :to="backtrackRecordBoxRef" :id="repoTargetIdRef"/>

<!--  <modalComponent v-model:show="exportErrorModalVisible">
    <template #title>
      导出失败
    </template>

    <div style="display: flex; justify-content: center; font-size: 28px;
      text-align: center;
      font-family: SourceHanSansSC-regular;
      letter-spacing: 2px;
      line-height: 40px;
      ">
      请确认该TF卡处于连接状态
    </div>

    <template #footer>
      <n-button color="rgb(99, 137, 155)" @click="exportErrorModalVisible=false">关闭</n-button>
    </template>
  </modalComponent>-->
</template>

<script setup>
import {inject, reactive, ref, shallowRef, toRaw, toRefs, watch, markRaw, onMounted} from "vue"
import Modal from "./Modal.vue"
import RepoList from './RepoList.vue'
import moment from 'moment'
import RepoModal from './RepoModal.vue'
import FixedEvidenceRepo from './FixedEvidenceRepo.vue'
import ExportErrorModal from './ExportErrorModal.vue'


const spinState = inject('spinState')
const operateRecordMenuVisible = ref(false)
const exportErrorModalVisible = ref(true)

const state = reactive({
  currentRoute: {},
  routes: [
    // {
    //   name: '回溯记录',
    //   dateformat: 'YYYY-MM-DD HH:mm:ss',
    //   dataList: [],
    //   component: RepoList,
    //   page: markRaw({
    //     size: 20,
    //     position: 0
    //   }),
    //   load: window.electronAPI.selectBacktrackRecord,
    //   currentData: null,
    //   resList: [],
    //   async getResData (currentData) {
    //     if (!currentData.parseObj) {
    //       currentData['parseObj'] = JSON.parse(currentData.fileInfoList)
    //       currentData.parseObj.forEach(item => {
    //         item.checked = false
    //       })
    //     }
    //     return currentData.parseObj
    //   },
    //   async exportFile() {
    //     const arr = state.currentRoute.resList.filter(item => item.checked).map(item => toRaw(item))
    //     await window.electronAPI.exportFile(arr)
    //     spinState.close()
    //   }
    // },
    {
      name: '固证记录',
      dateformat: 'YYYY-MM-DD',
      dataList: [],
      component: FixedEvidenceRepo,
      page: markRaw({
        size: 20,
        position: 0
      }),
      load: window.electronAPI.selectRecordOperationTime,
      currentData: null,
      resList: [],
      async getResData (currentData) {
        if (!currentData.repoList) {
          const res = await window.electronAPI.selectRecordByOperationTime(currentData.operationTime)
          currentData.repoList = res
        }
        currentData.repoList.forEach(item => {
          if (!item.checked) item.checked = false
        })
        return currentData.repoList
      },
      async exportFile() {
        spinState.open('Exporting the certificate report')
        const arr = state.currentRoute.resList.filter(item => item.checked).map(item => {
          const o = toRaw(item)
          if (typeof o.videoList !== 'object') o.videoList = JSON.parse(o.videoList)
          return o
        })
        await window.electronAPI.exportPdf(arr)
        spinState.close()
      }
    }
  ]
})



const { currentRoute, routes } = toRefs(state)

const m = {
  async changeRoute (route) {
    spinState.open('switching...')
    state.currentRoute = route
    if (!state.currentRoute.dataList.length) {
      const res = await state.currentRoute.load(state.currentRoute.page)
      state.currentRoute.dataList.push(...res)
      if (res.length) {
        state.currentRoute.page.position = state.currentRoute.page.position + state.currentRoute.page.size
      }
      if (!state.currentRoute.currentData) {
        m.checkedItem(state.currentRoute.dataList[0])
      }
    }
    spinState.close()
  },
  scrollCb (event) {
    /*const y = (event.target.scrollHeight - event.target.clientHeight) * 0.8
    if (event.target.scrollTop > y) {
      state.currentRoute.load(state.currentRoute.page).then(res => {
        state.currentRoute.dataList.push(...res)
        if (res.length) {
          state.currentRoute.page.position = state.currentRoute.page.position + state.currentRoute.page.size
        }
      })
    }*/
    const element = event.target

    const y = Math.abs(element.scrollHeight - element.clientHeight - element.scrollTop) < (element.clientHeight * 0.2)
    if (y) {
      state.currentRoute.load(state.currentRoute.page).then(res => {
        if (res.length) {
          state.currentRoute.dataList.push(...res)
          state.currentRoute.page.position = state.currentRoute.page.position + state.currentRoute.page.size
        }
      })
    }
  },
  async checkedItem (data) {
    spinState.open('switching...')
    state.currentRoute.currentData = data
    state.currentRoute.resList = await state.currentRoute.getResData(state.currentRoute.currentData)
    spinState.close()
  },
  updateSelectAll (val) {
    state.currentRoute.resList.forEach(item => item.checked = val)
  }
}
let { changeRoute, scrollCb, checkedItem, updateSelectAll } = m

m.changeRoute(state.routes[0])




const backtrackRecordBoxRef = ref()
const dataList = ref([])
const checkedBacktrackRecord = ref()

const resources = ref([])


// const operateRecordMenuCheckVal = ref('回溯记录')

const visibleRef = shallowRef(false)

const repoModalRef = ref('')
const repoTargetIdRef = ref()



const changeModal = (id) => {

  visibleRef.value = false
  repoTargetIdRef.value = id
  repoModalRef.value.modalVisible = true

}

/*const updateSelectAll = (val) => {
  resources.value.forEach(item => item.checked = val)
}*/

/*const exportFile = async () => {
  spinState.visible = true
  if (operateRecordMenuCheckVal.value === '固证记录') {
    spinState.message = '正在导出固证报告'
    const arr = resources.value.filter(item => item.checked).map(item => {
      const o = toRaw(item)
      if (typeof o.videoList !== 'object') o.videoList = JSON.parse(o.videoList)
      return o
    })
    await window.electronAPI.exportPdf(arr)


  } else if (operateRecordMenuCheckVal.value === '回溯记录') {
    spinState.message = '正在导出文件'
    const arr = resources.value.filter(item => item.checked).map(item => toRaw(item))
    await window.electronAPI.exportFile(arr)
  }

  spinState.visible = false
}*/



</script>

<style scoped>

.backtrack-record-box {
  /*background-color: #535bf2;*/
  display: grid;
  grid-template-columns: 300px 3fr;
  height: calc(100vh - var(--header-height));
  --backtrack-record-header-height: 53px;
}

.backtrack-record-box > .left {
  /*background-color: pink;*/
  display: grid;
  overflow-y: auto;
  grid-template-rows: auto 1fr;
}

.backtrack-record-box > .left .header {
  /*background-color: #536e81;*/
  height: var(--backtrack-record-header-height);
  font-family: SourceHanSansSC;
  font-weight: 700;
  font-size: 26px;
  color: rgb(255, 255, 255);
  font-style: normal;
  letter-spacing: 0;
  line-height: var(--backtrack-record-header-height);
  text-align: center;
}

.backtrack-record-box > .left .content{
  overflow-y: auto;
  padding: 20px 20px;
  display: flex;
  flex-direction: column;
  grid-row-gap: 15px;
}

.backtrack-record-box > .left .content .item {
  /*background-color: rgb(83, 110, 131);*/
  height: 45px;
  line-height: 45px;
  border-radius: 20px;
  text-align: center;
  font-weight: 400;
  font-size: 20px;
  letter-spacing: 0;
  font-family: SourceHanSansSC;
  font-style: normal;
}

.backtrack-record-box > .left .content .item:hover {
  background-color: rgb(83, 110, 131);
}

.backtrack-record-box > .left .content .checked {
  background-color: rgb(83, 110, 131);
}



.backtrack-record-box > .right {
  /*background-color: palegreen;*/
  display: grid;
  overflow-y: auto;
  grid-template-rows: auto 1fr;
}

.backtrack-record-box > .right .header {
  /*background-color: #536e81;*/
  height: var(--backtrack-record-header-height);
  display: flex;
  /*align-items: center;*/
  align-items: flex-start;
  justify-content: space-between;
  padding: 0 20px;
  padding-top: 10px;

  /*font-family: SourceHanSansSC;
  font-weight: 700;
  font-size: 36px;
  color: rgb(255, 255, 255);
  font-style: normal;
  letter-spacing: 0px;
  line-height: var(--backtrack-record-header-height);*/
}



.backtrack-record-box > .right .header .l {
  /*display: flex;*/
  /*position: relative;*/
}

.backtrack-record-box > .right .header .l .box {
  position: absolute;
  font-size: 20px;
  //z-index: 9999;
}

.backtrack-record-box > .right .header .l .active {
  position: absolute;
  font-size: 20px;
  //z-index: 9999;
  /*background-color: #535bf2;*/
  background: linear-gradient(180deg, rgba(128,194,213,1) 0%,rgba(130,201,219,0.92) 13%,rgba(55,65,86,1) 96%);
}

.checked-operate-record {
  display: flex;
  flex-direction: row;
  /*column-gap: 10px;*/
}

.arrow {
  display: flex;
  align-items: center;
}

.arrow svg {
  fill: rgb(255, 255, 255);
  width: 25px;
  height: 25px;
}

.operate-record-menu {
  /*margin-top: 10px;*/
  /*height: 200px;*/
  /*position: absolute;*/
  /*background-color: #989292;*/
  z-index: 9999;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
}



.backtrack-record-box > .right .header .r {
  display: flex;
  column-gap: 20px;
}

.backtrack-record-box > .right .header .r .select-all {
  align-items: center;
  /*--n-size: 28px;*/
}

.backtrack-record-box > .right .header .r .select-all .n-checkbox-box {
  --n-size: 28px;
}

.backtrack-record-box > .right .content{
  overflow-y: auto;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, 255px);
  justify-content: center;
  grid-row-gap: 25px;
}



.backtrack-record-box > .right .content .item {
  /*border: 1px pink solid;*/
  display: flex;
  flex-direction: column;
  place-items: center;
  padding: 10px;
  position: relative;
}

.backtrack-record-box > .right .content .item:hover .item-select {
  visibility: unset;
}

.img-box {
  width: 202px;
  height: 163px;
  border-radius: 25px;
  /*border: 1px greenyellow solid;*/
  display: flex;
  flex-direction: column;
  place-items: center;
  overflow: hidden;
  position: relative;
}

.img-box > img {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 99;
}

.img-box > .context {
  width: 100%;
  height: 35px;
  line-height: 35px;
  position: absolute;
  z-index: 999;
  bottom: 10px;
  background: rgba(0, 0, 0, 0.59);
  color: rgb(255, 255, 255);
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  box-sizing: border-box;
}

.item-select {
  z-index: 999;
  position: absolute;
  top: 10px;
  right: 10px;
  visibility: hidden;
}

.item :deep(.n-checkbox--checked) {
  visibility: unset;
}

.backtrack-record-box > .right .content .item > .context {
  border-radius: 10px;
  height: 45px;
  /*background: rgb(108, 153, 172);*/
  background: rgb(64, 142, 175);
  justify-content: center;
  padding: 0 10px;
  line-height: 20px;
  font-size: 18px;
  text-align: center;
  align-items: center;
  display: flex;
  margin: 10px 20px;
}

</style>