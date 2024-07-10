<template>
  <!--  <div>
    <n-button @click="openFileDialog()">选择文件夹</n-button>
  </div>-->

  <div
    style="
      display: flex;
      flex-direction: column;
      place-items: center;
      margin-left: 170px;
    "
  >
    <div class="menu">
      <div class="menu__item" @click="openFileDialog()"></div>
      <div class="menu__item" @click="showSubMenu = !showSubMenu"></div>
      <div class="menu__item" @click="menuRouting(BacktrackRecord)"></div>
      <div class="menu__item" @click="upgradeModalVisible = true"></div>
    </div>

    <div class="sub-menu" v-show="showSubMenu">
      <div class="sub-menu__item" @click="handleMenuitem(0)">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <g transform="translate(-233.663 -276.663)">
              <rect class="a" style="fill: none" width="24" height="24" transform="translate(233.663 276.663)"/>
              <path class="b" style="fill: #fff" d="M65.946,112.55H64.2v2.934a1.333,1.333,0,0,0,1.332,1.337h2.979v-1.744H65.946ZM82.63,102.469V99.9H80.042V98.2H83.02v0a1.334,1.334,0,0,1,1.334,1.334v2.934Zm-.563,10.064-6.65-6.65a4.7,4.7,0,0,0-6.431-5.923l3.159,3.162-2.217,2.217-3.162-3.162a4.7,4.7,0,0,0,5.923,6.431l6.65,6.65a.7.7,0,0,0,1.017,0l1.708-1.708A.7.7,0,0,0,82.068,112.532Z" transform="translate(171.386 181.103)"/>
            </g>
          </svg>
        </div>
        <span>Video Repair</span>
        <n-icon size="24" color="#ffffff">
          <QuestionCircle16Regular />
        </n-icon>
      </div>
      <div class="sub-menu__item" @click="handleMenuitem(1)">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <g transform="translate(-234.021 -360.021)">
              <rect style="fill:none;" class="a" width="24" height="24" transform="translate(234.021 360.021)"/>
              <path style="fill:#fff;" class="b" d="M-3006.926,14.293h-10.447a2.666,2.666,0,0,1-1.041-.2,2.587,2.587,0,0,1-.83-.557,2.571,2.571,0,0,1-.557-.84,2.744,2.744,0,0,1-.2-1.051V2.586a2.257,2.257,0,0,1,.189-.872,2.856,2.856,0,0,1,.536-.831,3.048,3.048,0,0,1,.819-.63A2.187,2.187,0,0,1-3017.415,0h10.446a2.813,2.813,0,0,1,1.061.2,2.771,2.771,0,0,1,.862.547,2.524,2.524,0,0,1,.578.831,2.564,2.564,0,0,1,.209,1.03V4.435a.8.8,0,0,1-.22.368c-.152.181-.312.39-.473.62a7.052,7.052,0,0,0-.473.777,1.845,1.845,0,0,0-.22.862,1.784,1.784,0,0,0,.22.851,5.851,5.851,0,0,0,.473.746,5.149,5.149,0,0,0,.473.557c.146.146.22.242.22.284v2.207a1.666,1.666,0,0,1-.263.81,4.343,4.343,0,0,1-.651.851,3.728,3.728,0,0,1-.862.662A1.858,1.858,0,0,1-3006.926,14.293Zm-6.192-6.23h0c2.131,0,3.613.149,4.737,2.14a6.939,6.939,0,0,0-.879-2.216,4.4,4.4,0,0,0-3.858-2.216V4.09l-3.414,3.057,3.414,2.853V8.064Zm14.431,5.178a1.064,1.064,0,0,1-.431-.125,5.157,5.157,0,0,1-.525-.294c-.174-.111-.34-.225-.495-.337a2.863,2.863,0,0,1-.336-.273c-.186-.157-.464-.425-.831-.8a16.7,16.7,0,0,1-1.125-1.282,11.558,11.558,0,0,1-1-1.471,2.854,2.854,0,0,1-.431-1.387,3,3,0,0,1,.462-1.44,11.017,11.017,0,0,1,1.114-1.587,15.944,15.944,0,0,1,1.367-1.44,11.8,11.8,0,0,1,1.2-1c.129-.085.3-.188.514-.3a1.244,1.244,0,0,1,.579-.178.762.762,0,0,1,.736.315,1.658,1.658,0,0,1,.168.778v9.647a1.441,1.441,0,0,1-.242.82A.821.821,0,0,1-2998.687,13.241Z" transform="translate(3254.881 364.875)"/>
            </g></svg>
        </div>
        <span>Video Recovery</span>
        <n-icon size="24" color="#ffffff">
          <QuestionCircle16Regular />
        </n-icon>
      </div>
      <div class="sub-menu__item" @click="handleMenuitem(2)">
<!--        <span>Judgment Function</span>-->
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <g transform="translate(-233.658 -459.658)">
              <rect style="fill: none" class="a" width="24" height="24" transform="translate(233.658 459.658)"/>
              <path style="fill: #fff" class="b" d="M138.154,147.238h-1.069a.5.5,0,0,1-.534-.534V128.534a.5.5,0,0,1,.534-.534h1.069a.5.5,0,0,1,.534.534V146.7A.5.5,0,0,1,138.154,147.238Zm-2.672-2.138h-6.413A1.072,1.072,0,0,1,128,144.031V131.206a1.072,1.072,0,0,1,1.069-1.069h6.413V145.1Zm10.688-14.963h-6.413v2.138h4.809a.5.5,0,0,1,.534.534v9.619a.5.5,0,0,1-.534.534h-4.809V145.1h6.413a1.072,1.072,0,0,0,1.069-1.069V131.206A1.072,1.072,0,0,0,146.169,130.137Z" transform="translate(108.039 334.039)"/>
            </g></svg>
        </div>
        <span>Auxiliary analysis and judgement</span>
        <n-icon size="24" color="#ffffff">
          <QuestionCircle16Regular />
        </n-icon>
      </div>
      <div class="sub-menu__item" @click="handleMenuitem(3)">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <g transform="translate(-234.389 -564.389)">
              <rect style="fill: none" class="a" width="24" height="24" transform="translate(234.389 564.389)"/>
              <path style="fill:#fff" class="b" d="M-3251.176-544.028a4.163,4.163,0,0,1-4.163-4.162V-558.3a4.163,4.163,0,0,1,4.163-4.161h9.008a1.034,1.034,0,0,1,1.034,1.034v.188a1.035,1.035,0,0,1-1.034,1.034h-9.171a1.93,1.93,0,0,0-1.364.565,1.921,1.921,0,0,0-.562,1.366v8.835l3.762-4.563a1.1,1.1,0,0,1,.85-.4,1.1,1.1,0,0,1,.851.4l4.323,5.237,1.447-1.755a1.1,1.1,0,0,1,.851-.4,1.1,1.1,0,0,1,.85.4l3.25,3.943c.022.028.042.058.061.085a1.923,1.923,0,0,0,1.061-1.717v-6.07a1.035,1.035,0,0,1,1.035-1.034v0a1.035,1.035,0,0,1,1.034,1.034v6.1a4.162,4.162,0,0,1-4.162,4.162Zm9.375-10.622-1.215-.667,1.215-.666.667-1.216.666,1.216,1.216.666-1.216.667-.666,1.215Zm4.417-4.045-2.083-1.138,2.083-1.14,1.142-2.084,1.14,2.084,2.085,1.138-2.084,1.14-1.141,2.087Z" transform="translate(3490.567 1129.932)"/>
            </g></svg>
        </div>
        <span>Image Processing</span>
        <n-icon size="24" color="#ffffff">
          <QuestionCircle16Regular />
        </n-icon>
      </div>
    </div>

    <!--    <img src="../assets/index/history@1x.png" height="572" width="572"/>-->
    <img src="../assets/index/Frame30.png" height="572" width="572" />
<!--    <div style="font-size: 36px">MTM-Video Forensics</div>-->
<!--    <div style="font-size: 36px">for Removable Devices</div>-->
    <!-- <div>欢迎使用效哥行车记录仪提取固证系统</div> -->
    <!-- <div>点击下方按钮开始全面扫描您的TF卡</div> -->
    <!-- <img src="../assets/index/群组@1x.png" height="123" width="118" @click="openFileDialog()" class="pick-dir"/> -->

    <ModalComponent v-model:show="upgradeModalVisible">
      <n-scrollbar style="max-height: 500px">
      <div
        style="
          display: flex;
          justify-content: start;
          font-size: 18px;
          font-weight: 400;
          flex-direction: column;
          text-align: center;
          font-family: SourceHanSansSC-regular;
          letter-spacing: 2px;
          line-height: 35px;
          justify-items: center;
          min-height: 50vh;
          max-height: 80vh;
        "
      >
        <template v-if="innerHtml">
          <div v-html="innerHtml"></div>
        </template>
        <template v-else>
          <div style="margin-bottom: 40px">
<!--            To activate advanced features, please contact us-->
            Contact us
          </div>
          <div
            style="
              font-size: 16px;
              align-items: center;
              display: flex;
              gap: 8px;
              margin-left: 54px;
            "
          >
            <n-icon size="24" color="#ffffff">
              <EmailSharp />
            </n-icon>
            <span>Email：info@storm-mt.com</span>
          </div>
          <div
            style="
              font-size: 16px;
              align-items: center;
              display: flex;
              gap: 8px;
              margin-left: 54px;
            "
          >
            <n-icon size="24" color="#ffffff">
              <LanguageSharp />
            </n-icon>
            <span>official website：https://www.storm-mt.com/</span>
          </div>
          <div
            style="
              font-size: 16px;
              align-items: center;
              display: flex;
              gap: 8px;
              margin-left: 54px;
            "
          >
<!--            <n-icon size="24" color="#ffffff">
              <SettingsPhoneSharp />
            </n-icon>-->
            <n-icon size="24" color="#ffffff">
              <svg class="icon" width="200px" height="200.00px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#ffffff" d="M714.666667 595.626667C725.333333 601.173333 732.16 604.16 734.293333 608.426667 736.853333 613.12 736 634.453333 725.333333 658.773333 716.8 682.666667 672.426667 705.706667 652.8 706.56 633.173333 707.413333 632.746667 721.92 526.506667 675.413333 420.266667 628.906667 356.266667 515.413333 351.146667 508.16 346.026667 500.906667 310.186667 449.28 311.893333 396.8 314.026667 344.746667 341.333333 320 352.426667 309.76 362.666667 298.666667 374.186667 297.386667 381.44 298.666667L401.493333 298.666667C407.893333 298.666667 416.853333 296.106667 424.96 317.866667L454.4 397.653333C456.96 403.2 458.666667 409.6 454.826667 416.426667L443.306667 433.92 426.666667 451.84C421.546667 456.96 415.573333 462.506667 421.546667 473.173333 426.666667 484.266667 448 519.68 477.866667 549.12 516.693333 586.666667 550.826667 599.04 561.066667 604.586667 571.306667 610.56 577.706667 609.706667 584.106667 602.88L618.666667 562.773333C626.773333 552.106667 633.6 554.666667 643.413333 558.08L714.666667 595.626667M512 85.333333C747.52 85.333333 938.666667 276.48 938.666667 512 938.666667 747.52 747.52 938.666667 512 938.666667 427.946667 938.666667 349.866667 914.346667 283.733333 872.533333L85.333333 938.666667 151.466667 740.266667C109.653333 674.133333 85.333333 596.053333 85.333333 512 85.333333 276.48 276.48 85.333333 512 85.333333M512 170.666667C323.413333 170.666667 170.666667 323.413333 170.666667 512 170.666667 585.386667 193.706667 653.226667 232.96 708.693333L192 832 315.306667 791.04C370.773333 830.293333 438.613333 853.333333 512 853.333333 700.586667 853.333333 853.333333 700.586667 853.333333 512 853.333333 323.413333 700.586667 170.666667 512 170.666667Z" /></svg>
            </n-icon>
            <span>WhatsApp：+44 7383 258694</span>
          </div>
          <div style="display: flex; justify-content: center">
            <img
              :src="qrcodeSrc"
              style="width: 200px; margin-top: 40px"
              alt="二维码"
            />
          </div>
        </template>
      </div>
      </n-scrollbar>
    </ModalComponent>
  </div>
</template>

<script setup>
import axios from "axios";
import { reactive, ref, onMounted, watch } from "vue";
import ModalComponent from "./ModalComponent.vue";
import BacktrackRecord from "./BacktrackRecord.vue";

import {
  SettingsPhoneSharp,
  LanguageSharp,
  EmailSharp,
} from "@vicons/material";
import { QuestionCircle16Regular } from "@vicons/fluent";

let showSubMenu = ref(false);

let upgradeModalVisible = ref(false);

const qrcodeSrc = new URL(
  "@/assets/c5e7a159c1cdf153cb7e248f638a9e0b.jpg",
  import.meta.url
).href;

const props = defineProps({
  openFileDialog: Function,
  routing: Function,
});

const menuRouting = (component) => {
  props.routing(component);
};

const innerHtml = ref("");
const menuList = ref([]);

const handleMenuitem = (index) => {
  if (menuList.value.length) {
    innerHtml.value = menuList.value[index].content;
  }
  upgradeModalVisible.value = true;
};

watch(upgradeModalVisible, (value) => {
  if (!value) {
    setTimeout(() => {
      innerHtml.value = "";
    }, 500);
  }
});

onMounted(() => {
  axios
    .get(
      import.meta.env.VITE_HTTP_HOST + "/client/productFeature/getFeatures/58"
    )
    .then((response) => {
      console.log(response.data);
      menuList.value = response.data.data;
    })
    .catch((reason) => {
      console.error(reason);
    });
});
</script>

<style scoped>
.pick-dir {
  cursor: pointer;
}

.menu {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: 170px;
  background: url("../assets/index/bg_menu.png") no-repeat center;
}
.menu__item {
  width: 100%;
  height: 25%;
  cursor: pointer;
}

.sub-menu {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 170px;
  width: 170px;
  padding-top: 125px;
  background-color: rgba(255, 255, 255, 0.2);
}

.sub-menu__item {
  //width: 100%;
  //margin: 20px 0 20px 10px;
  margin: 20px 5px 20px 10px;
  padding: 20px 0;
  text-align: center;
  cursor: pointer;
  display: flex;
  align-items: center;
  grid-column-gap: 5px;
  //justify-content: space-around;
}

.sub-menu__item > span {
  text-align: left;
  font-size: 12px;
}

.sub-menu__item > div {
  width: 24px;
  height: 24px;
}

.sub-menu__item:hover {
  background-color: #a5dfee;
  //color: #9cc9d5;
}


.sub-menu__item:deep(.n-icon) {
  margin-left: auto;
}
</style>
