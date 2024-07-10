<template>
  <!--  <video controls :src="`item:///C:\\Users\\fanjun\\Downloads\\test\\mv\\【那些野田洋次郎为别人写的歌】 aimer 酸欠少女 Chara Adieu  上白石萌音 ハナレグ - 1.Aimer—蝶々結び(Av975423577,P1).mp4`"></video>-->
  <div class="box">
    <div
      class="item"
      v-for="(file, index) in resources"
      @click="itemClick(file)"
    >
      <div :class="`item-box ${file.playing ? 'playing' : ''}`">
        <!--        <img class="media" :src="`item:///${encodeURI(file)}`">-->
        <!--        <video :class="`media ${file.playing ? 'playing' : ''}`"
               @playing="videoPlaying(file, $event)"
               @pause="file.playing = false"
               controls
               :src="`media://${encodeURI(file.metadata?.format?.filename)}`"
        ></video>-->

        <video
          :class="`media ${file.playing ? 'playing' : ''}`"
          @pause="file.playing = false"
          controls
          :src="`media://${encodeURI(file.metadata?.format?.filename)}`"
          volume="0.5"
          @error="loadError(file, $event)"
        ></video>

        <div class="context">
          <span>{{ formatDuration(file.metadata?.format?.duration) }}</span>
          <span
            >{{ formatSize(file.metadata?.format?.size) }}
            {{ file?.extname?.substr(1)?.toUpperCase() }}</span
          >
        </div>


        <div class="state">
          <!-- <template v-if="file.fileState === '常规'"
            >convention<img
              src="../assets/回溯结果/3Copy3@1x.png"
              height="20"
              width="20"
          /></template> -->
          <template v-if="file.fileState === '损坏'"
            >damage<img
              src="../assets/回溯结果/4Copy2@1x.png"
              height="20"
              width="20"
          /></template>
        </div>
      </div>
      <n-checkbox
          class="item-select"
          v-model:checked="file.checked"
          v-if="
            !file.loadFailed &&
            (file.fileState === '常规' || file.fileState === '修复')
          "
      ></n-checkbox>
      <div class="context">
        {{ moment(file?.stat?.birthtime).format("YYYY-MM-DD hh:mm:ss") }}
      </div>
    </div>
  </div>

  <modalComponent v-model:show="exportErrorModalVisible">
    <template #title> Export failure </template>

    <div
      style="
        display: flex;
        justify-content: center;
        font-size: 28px;
        text-align: center;
        font-family: SourceHanSansSC-regular;
        line-height: 40px;
      "
    >
      The video is damaged and cannot be exported/authenticated.
    </div>

    <template #footer>
      <n-button
        color="rgb(99, 137, 155)"
        @click="exportErrorModalVisible = false"
        >Close</n-button
      >
    </template>
  </modalComponent>
  <!--  {{ resources }}-->
</template>

<script setup>
import moment from "moment";
import { ref, getCurrentInstance, watch } from "vue";
import ModalComponent from "./ModalComponent.vue";

const props = defineProps({
  filePaths: [],
  resources: [],
});

const exportErrorModalVisible = ref(false);

let playingRef = null;
let playingEvent = null;

const loadError = (file, event) => {
  console.log(file, event);
  file["loadFailed"] = true;
};

const itemClick = (item) => {
  if (item.loadFailed) {
    exportErrorModalVisible.value = true;
  }
};

const videoPlaying = (playing, $event) => {
  if (playingEvent) playingEvent.target.pause();
  playingEvent = $event;
  playing.playing = true;
  if (playingRef) playingRef.playing = false;
  playingRef = playing;
};

const formatDuration = (s) => {
  if (!s) return "0s";
  if (s < 0) s = -s;
  const time = {
    day: Math.floor(s / 60 / 60 / 24),
    h: Math.floor(s / 60 / 60) % 24,
    m: Math.floor(s / 60) % 60,
    s: Math.floor(s) % 60,
  };
  return Object.entries(time)
    .filter((val) => val[1] !== 0)
    .map(([k, v]) => `${v}${k}`)
    .join(" ");
};

const formatSize = (s) => {
  if (!s) return "0MB";
  return (s / 1024 / 1024).toFixed(2) + "MB";
};

// 获取页面的实例对象
// const pageInstance = getCurrentInstance()
</script>

<style scoped>
video::-webkit-media-controls-enclosure {
  /*display: none;*/
  visibility: hidden;
}

.item-box:hover video::-webkit-media-controls-enclosure {
  visibility: unset;
}

.item-box:hover .context {
  visibility: hidden;
}

.item-box.playing .context {
  visibility: hidden;
}

.box .item-box.playing {
  overflow: unset;
}

.box {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, 300px);
  justify-content: center;
  grid-row-gap: 50px;
}

.item {
  /*border: 1px pink solid;*/
  display: flex;
  flex-direction: column;
  place-items: center;
  padding: 10px;
  position: relative;
}

.item-box {
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

.box .item-box:hover {
  overflow: unset;
}

.item-box > .media {
  /*width: 100%;*/
  height: 100%;
  position: absolute;
  z-index: 99;
}

.item-box > .context {
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

.item > .context {
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

.state {
  z-index: 999;
  position: absolute;
  top: 10px;
  right: 20px;
  display: flex;
  justify-items: center;
}

/*.box .item:hover .item-select {
  visibility: unset;
}

.item-select {
  z-index: 999;
  position: absolute;
  top: 10px;
  left: -20px;
  visibility: hidden;
}*/

.box .item:hover .item-select {
  visibility: unset;
}

.item-select {
  z-index: 999;
  position: absolute;
  top: 10px;
  left: 10px;
  //visibility: hidden;
}

.item :deep(.n-checkbox--checked) {
  //visibility: unset;
}
</style>
