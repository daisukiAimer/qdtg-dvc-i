<template>
  <div class="title">
    <div class="left">
      <n-icon size="40" @click="backPick" v-show="currentPage !== PickDir">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 24 24"
        >
          <path
            d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6l6 6l1.41-1.41z"
            fill="currentColor"
          ></path>
        </svg>
      </n-icon>
    </div>
    <div class="right">
      <!-- <div class="user-info">
        <div class="avatar-box"> -->
      <!--          <img :src="`media:///${encodeURI('../assets/avatar.jpg')}`" height="50" width="50"/>-->
      <!-- <img src="../assets/avatar.jpg" height="50" width="50"/>
        </div>
        <span class="name">效哥</span>
      </div>
      <div class="vertical-line"></div> -->
      <div class="operate">
        <div style="position: relative" @mouseleave="titleMenuVisible = false">
          <n-icon
            size="40"
            @click="titleMenuVisible = !titleMenuVisible"
            class="title-menu-icon"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 24 24"
            >
              <path
                d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"
                fill="currentColor"
              ></path>
            </svg>
          </n-icon>

          <div class="title-menu" v-show="titleMenuVisible">
            <div class="arrow"></div>
            <div class="title-menu-item-box">
              <!-- <div class="title-menu-item" @click="menuRouting(BacktrackRecord)">操作记录</div>
              <div class="title-menu-line"></div> -->

              <div class="title-menu-item" @click="upgradeModalVisible = true">
                About us
              </div>
              <!-- <div class="title-menu-line"></div> -->

              <!--              <div class="title-menu-item" v-show="ddNumberAnimation.diskPartition" @click="ddNumberAnimation.start()">分区备份</div>
              <div class="title-menu-line" v-show="ddNumberAnimation.diskPartition"></div>-->

              <!-- <div class="title-menu-item" @click="ddNumberAnimation.chooseDiskpart()">分区备份</div>
              <div class="title-menu-line"></div>

              <div class="title-menu-item">退出登录</div> -->
            </div>
          </div>
        </div>

        <n-icon size="40" @click="winMinimize" class="winMinimize">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 24 24"
          >
            <path d="M19 12.998H5v-2h14z" fill="currentColor"></path>
          </svg>
        </n-icon>

        <n-icon size="40" @click="winClose" class="winClose">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 24 24"
          >
            <path
              d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z"
              fill="currentColor"
            ></path>
          </svg>
        </n-icon>
      </div>
    </div>
  </div>

  <modalComponent v-model:show="upgradeModalVisible">
    <div
      style="
        display: flex;
        justify-content: center;
        font-size: 24px;
        font-weight: 400;
        flex-direction: column;
        text-align: center;
        font-family: SourceHanSansSC-regular;
        letter-spacing: 2px;
        line-height: 35px;
        justify-items: center;
        align-items: center;
      "
    >
      <!-- <img src="../assets/logo.png" width="254" /> -->
      <div
        style="
          white-space: NOWRAP;
          color: black;
          font-size: 18px;
          font-weight: bold;
          align-items: center;
          gap: 10px;
        "
      >
<!--        <img :src="iconSrc" width="42" height="42" />-->
        <div>Moebius Technology(Singapore)PTE.LTD-S.T.O.R.M</div>
        <div style="font-size: 16px; margin-top: 10px; display: flex; align-items: center; justify-content: center">
          <img :src="iconSrc" width="42" height="42" style="margin-right: 10px"/>
          MTM-Video Forensics
        </div>
      </div>

      <div style="font-size: 16px; position: relative; top: 30px; color: black">
        VERSION V 1.0
      </div>
      <div style="display: flex; flex-direction: column; align-items: start">
        <div style="margin: 100px 0 0 0; font-size: 18px">
          Registration Information
        </div>
        <div style="margin: 0 0 0; font-size: 18px">
          <span v-if="user && user.country"
            >Country: {{ user && user.country }}</span
          >
          <span v-else>Country: unknown country</span>
        </div>
        <div style="margin: 0 0 0; font-size: 18px">
          <span v-if="user && user.username"
            >User Name: {{ user && user.username }}</span
          >
          <span v-else>User Name: unknown username</span>
        </div>
        <div style="margin: 0 0 20px; font-size: 18px">
          <span v-if="user && user.unit">Unit: {{ user && user.unit }}</span>
          <span v-else>Unit: unknown unit</span>
        </div>


<!--        <div style="margin: 0 0 20px; font-size: 18px">
          <span>uniqueCode: {{ uniqueCode }}</span>
        </div>-->
      </div>
<!--      <div
        style="
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 18px;
          line-height: 1;
          white-space: nowrap;
        "
      >
        <span>software license</span>
        <div
          style="
            width: 3px;
            border: 2px solid rgba(187, 187, 187, 100);
            box-sizing: border-box;
            border-radius: 15%;
            height: 30px;
            margin: 0 10px;
          "
        ></div>
        <span>Term of service</span>
        <div
          style="
            width: 3px;
            border: 2px solid rgba(187, 187, 187, 100);
            box-sizing: border-box;
            border-radius: 15%;
            height: 30px;
            margin: 0 10px;
          "
        ></div>
        <span>privacy statement</span>
      </div>-->
      <div style="font-size: 16px; position: relative; top: 30px">
        Copyright©2023
      </div>
    </div>
  </modalComponent>
</template>

<script setup>
import { inject, ref, shallowRef, computed, watchEffect } from "vue";
import PickDir from "./PickDir.vue";
import BacktrackRecord from "./BacktrackRecord.vue";
import ModalComponent from "./ModalComponent.vue";
import { useMessage } from "naive-ui";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import axios from "axios";

window.$message = useMessage();

const iconSrc = new URL(
  // "@/assets/Snipaste_2023-08-25_21-00-41.png",
  "@/assets/app.png",
  import.meta.url
).href;

const props = defineProps({
  currentPage: shallowRef,
  backPick: Function,
  routing: Function,
  user: Object,
  uniqueCode: String,
});

watchEffect(() => console.log("用户信息", props.user));

const titleMenuVisible = ref(false);
const upgradeModalVisible = ref(false);

/*const winClose = () => {
  FingerprintJS.load()
    .then((fp) => {
      return fp.get();
    })
    .then((result) => {
      const visitorId = result.visitorId;
      console.log("机器码", visitorId);

      let date = new Date();
      let timezone = "GMT" + date.toString().split("GMT")[1];
      let operateTime =
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1) +
        "-" +
        date.getDate() +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes() +
        ":" +
        date.getSeconds();
      console.log(operateTime);

      axios
        .post(
          import.meta.env.VITE_HTTP_HOST + "/client/data/acquisition/save",
          {
            // axios.post('http://localhost:8063/data/acquisition/save', {
            productId: 58,
            productVersionId: 24,
            type: 2, // 关闭时
            uniqueCode: visitorId,
            timezone: timezone,
            operateTime: operateTime,
          },
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        )
        .then(function (response) {
          console.log("数据采集埋点", response);
        })
        .catch(function (error) {
          console.log(error);
        });
    });
  window.electronAPI.winClose();
};*/

const winClose = () => {

  window.electronAPI.generateMachineId().then(machineId => {
    const visitorId = machineId;
    console.log("机器码", visitorId);

    let date = new Date();
    let timezone = "GMT" + date.toString().split("GMT")[1];
    let operateTime =
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1) +
        "-" +
        date.getDate() +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes() +
        ":" +
        date.getSeconds();
    console.log(operateTime);

    axios
        .post(
            import.meta.env.VITE_HTTP_HOST + "/client/data/acquisition/save",
            {
              // axios.post('http://localhost:8063/data/acquisition/save', {
              productId: 58,
              productVersionId: 24,
              type: 2, // 关闭时
              uniqueCode: visitorId,
              timezone: timezone,
              operateTime: operateTime,
            },
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
        )
        .then(function (response) {
          console.log("数据采集埋点", response);
        })
        .catch(function (error) {
          console.log(error);
        });
  })


  window.electronAPI.winClose();
};
const winMinimize = () => {
  window.electronAPI.winMinimize();
};

const menuRouting = (component) => {
  titleMenuVisible.value = false;
  props.routing(component);
};

const ddNumberAnimation = inject("ddNumberAnimation");
</script>

<style scoped>
.title-menu-icon {
  cursor: pointer;
}

.title {
  height: var(--header-height);
  /*background-color: pink;*/
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  /* electron 表是元素可拖动*/
  -webkit-app-region: drag;
  position: relative;
  z-index: 99999;
}

.title-menu {
  position: absolute;
  right: -15px;
  width: 160px;
  border-radius: 30px;
  z-index: 99999;
  background-color: #536e81;
}

.arrow {
  top: -20px;
  right: 25px;
  position: absolute;
  border-color: transparent transparent #536e81 transparent;
  border-style: dashed dashed solid dashed;
  border-width: 10px;
}

.title-menu-item-box {
  display: flex;
  flex-direction: column;
  /*grid-row-gap: 3px;*/
  place-items: center;
  grid-template-columns: 1fr;
  padding: 10px 0;
}

.title-menu-item {
  height: 37px;
  /*display: flex;*/
  /*place-items: center;*/
  text-align: center;
  line-height: 37px;
  cursor: pointer;
}

.title-menu-line {
  height: 1px;
  /*width: 100px;*/
  width: 75%;
  background-color: rgba(187, 187, 187, 1);
  margin: 3px 0;
  border-radius: 3px;
}

.left {
  display: flex;
  justify-content: center;
  /* electron 表是元素不可拖动*/
  -webkit-app-region: no-drag;
}

.right {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: end;
  -webkit-app-region: no-drag;
}

.avatar-box {
  border-radius: 50%;
  overflow: hidden;
  height: 45px;
  width: 45px;
}

.user-info {
  display: flex;
  place-items: center;
}

.user-info > .name {
  margin-left: 10px;
}

.vertical-line {
  width: 4px;
  border-radius: 2px;
  background-color: rgba(187, 187, 187, 1);
  height: 50%;
  margin: 0 20px;
}

.operate {
  display: flex;
  justify-content: center;
}

.winMinimize:hover {
  background-color: #989292;
}

.winMinimize:active {
  background-color: rgba(152, 146, 146, 0.5);
}

.winClose:hover {
  background-color: red;
}

.winClose:active {
  background-color: rgba(255, 0, 0, 0.5);
}
</style>
