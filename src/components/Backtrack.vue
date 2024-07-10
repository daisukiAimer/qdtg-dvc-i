<template>
  <template v-if="loading">
    <!--    <img src="../assets/回溯过程/图片 Copy_状态 1@1x.png" height="572" width="572" class="backtrack-img"/>-->
    <div style="text-align: center">
      <img
        src="../assets/回溯过程/Frame30.png"
        height="572"
        width="572"
        class="backtrack-img"
      />
<!--      <p>Video extraction in progress</p>-->
      <p>Extracting video...</p>
    </div>
  </template>
  <template v-if="!loading">
    <!--    <n-spin style="position: unset; &#45;&#45;n-color: white; &#45;&#45;n-text-color: white" :show="spinState.visible">-->
    <div ref="containerRef" class="container">
      <header>
        <div class="l">Extraction Results</div>
        <div class="r">
          <n-button
            type="tertiary"
            color="rgb(99, 137, 155)"
            @click="visibleRef = true"
            :disabled="!resources.filter((item) => item.checked).length"
          >
            Evidence authentication
          </n-button>
          <n-button
            type="tertiary"
            color="rgb(99, 137, 155)"
            @click="exportFile"
            :disabled="!resources.filter((item) => item.checked).length"
          >
            Export
          </n-button>
          <n-checkbox
            class="select-all"
            style="--n-size: 28px"
            size="large"
            @update:checked="updateSelectAll"
            :checked="
              resources.filter((item) => item.checked).length ===
              resources.filter((item) => !item.loadFailed).length
            "
          >
            all
          </n-checkbox>
        </div>
      </header>
      <main>
        <n-scrollbar>
          <component :is="comRef" :resources="resources"></component>
        </n-scrollbar>
      </main>
      <!-- <footer style="text-align: center" @click="upgradeModalVisible = true">
        没有找到需要的视频？启动深度扫描
      </footer> -->
    </div>
    <!--
      <template #description>
        {{ spinState.message }}
      </template>
    </n-spin>
-->

    <modal
      v-model:visible="visibleRef"
      :to="containerRef"
      :resources="resources"
      :changeModal="changeModal"
    />

    <repoModal ref="repoModalRef" :to="containerRef" :id="repoTargetIdRef" />

    <modalComponent v-model:show="upgradeModalVisible">
      <template #title> 升级版本 </template>

      <div
        style="
          display: flex;
          justify-content: center;
          font-size: 28px;
          flex-direction: column;
          text-align: center;
          font-family: SourceHanSansSC-regular;
          letter-spacing: 2px;
          line-height: 40px;
        "
      >
        <div>该功能为高级版专属功能</div>
        <div>如需使用该功能请升级为高级版</div>
      </div>

      <template #footer>
        <n-button color="rgb(99, 137, 155)" @click="upgradeModalVisible = false"
          >取消</n-button
        >
        <n-button color="rgb(99, 137, 155)" @click="upgradeModalVisible = false"
          >确定</n-button
        >
      </template>
    </modalComponent>
  </template>
  <NModal :show="exportLoading">
    <!-- <NSpin></NSpin> -->
    <div style="width: 50%">
      <n-progress
        type="line"
        :percentage="percentage"
        :indicator-placement="'inside'"
        rail-color="rgba(0,0,0,0.1)"
        color="rgba(0,0,0,0.1)"
      />
    </div>
  </NModal>
</template>

<script setup>
import {
  ref,
  toRefs,
  toRaw,
  reactive,
  shallowRef,
  provide,
  inject,
  createApp,
  h,
} from "vue";
import Repo from "./Repo.vue";
import RepoList from "./RepoList.vue";
import Modal from "./Modal.vue";
import RepoModal from "./RepoModal.vue";
import ModalComponent from "./ModalComponent.vue";
import { useDialog } from "naive-ui";
import DDNumberAnimation from "./DDNumberAnimation.vue";
import { NModal, NSpin, useMessage } from "naive-ui";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import axios from "axios";

const exportLoading = ref(false);

const percentage = ref(0);

const message = useMessage();

const props = defineProps({
  filePaths: [],
  diskPartition: "",
});
const dialog = useDialog();

const comRef = shallowRef(RepoList);
const loading = ref(true);
const resources = ref([]);
const visibleRef = shallowRef(false);
const upgradeModalVisible = ref(false);

const repoModalRef = ref("");
const repoTargetIdRef = ref();
const containerRef = ref();

const spinState = inject("spinState");

const getDirInfo = async () => {
  const res = await window.electronAPI.getDirInfo([props.diskPartition]);

  loading.value = false;
  resources.value = res;

  /*FingerprintJS.load()
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
            type: 3, // 扫描结束时
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
    });*/

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
              type: 3, // 关闭时
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

  await window.electronAPI.insertBacktrackRecord(res);
};

getDirInfo();
const ddNumberAnimation = inject("ddNumberAnimation");

const exportFile = async () => {
  const arrx = resources.value
    .filter((item) => item.checked)
    .map((item) => toRaw(item));

  exportLoading.value = true;

  // let timer = null
  percentage.value = 0;
  // window.setTimeout(() => {
  //   timer = window.setInterval(() => {
  //     if (percentage.value < 99) {
  //       percentage.value += 1
  //     }
  //   }, 500)
  // }, 6000)
  try {
    window.electronAPI.onExportV2Progress((v) => {
      percentage.value = v;
    });
    await window.electronAPI.exportFileV2(JSON.stringify(arrx));
    // window.clearInterval(timer)
    // percentage.value = 100
    // window.setTimeout(() => {
    message.success("Successful operation");
    exportLoading.value = false;
    // }, 500)
  } catch (error) {
    console.error(error);
    exportLoading.value = false;
  }

  if (Boolean(100)) return;

  const DDNumberAnimationawaitCallback = await new Promise((resolve) => {
    dialog.warning({
      title: "warn",
      content: "Whether to export the mirror of the current partition",
      positiveText: "is",
      negativeText: "no",
      onPositiveClick: () => {
        resolve(() => {
          ddNumberAnimation.start();
        });
      },
      onNegativeClick: () => {
        resolve();
      },
    });
  });

  spinState.visible = true;
  spinState.message = "Exporting file";
  const arr = resources.value
    .filter((item) => item.checked)
    .map((item) => toRaw(item));
  const { canceled, filePaths } = await window.electronAPI.exportFile(arr);

  if (!canceled) {
    ddNumberAnimation.outDir = filePaths[0];
    DDNumberAnimationawaitCallback();
  }

  spinState.visible = false;
};

const changeModal = (id) => {
  console.log("changeModal....", id);
  visibleRef.value = false;
  repoTargetIdRef.value = id;
  repoModalRef.value.modalVisible = true;
};

const updateSelectAll = (val) => {
  resources.value.forEach((item) => {
    if (!item.loadFailed) {
      item.checked = val;
    }
  });
};
</script>

<style scoped>
.backtrack-img {
  animation: mymove 5s infinite;
}

@keyframes mymove {
  50% {
    transform: rotate(360deg);
  }
}

.container {
  --header-height: 70px;
}

header {
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px 0 100px;
}

header .l {
  font-family: SourceHanSansSC;
  font-weight: 900;
  font-size: 50px;
  color: rgba(255, 255, 255, 1);
  font-style: normal;
  line-height: 72px;
  text-decoration: none;
}

header .r {
  display: flex;
  column-gap: 20px;
}

header .r .select-all {
  align-items: center;
}

header .r .select-all .n-checkbox-box {
  --n-size: 28px;
}

main {
  overflow-y: auto;
  position: absolute;
  top: var(--header-height);
  right: 0;
  bottom: 50px;
  left: 0;
}

footer {
  height: 50px;
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>
