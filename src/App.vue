<template>
  <n-config-provider>
    <n-dialog-provider>
      <n-message-provider>
        <n-spin
            style="position: unset; --n-color: white; --n-text-color: white"
            :show="spinState.visible"
        >
        <Title
          :currentPage="comRef"
          :backPick="backPick"
          :routing="routing"
          :user="user"
          :uniqueCode="uniqueCode"
        />

        <div class="content" ref="contentRef">

            <!--          <component :is="comRef" :openFileDialog="openFileDialog" :filePaths="filePaths"></component>-->
            <!--          <component :is="comRef" :openFileDialog="getLogicaldisk" :filePaths="filePaths"></component>-->
            <component
              :is="comRef"
              :openFileDialog="getLogicaldisk"
              :diskPartition="diskPartition"
              :routing="routing"
            ></component>



        </div>
          <template #description>
            {{ spinState.message }}
          </template>
        </n-spin>
        <component :is="ddNumberAnimationComponentRef" />

        <n-modal
          v-model:show="chooseDiskpartVisible"
          :to="contentRef"
          :mask-closable="false"
        >
          <n-card
            style="width: 800px"
            size="huge"
            role="dialog"
            aria-modal="true"
            class="model"
          >
            <template #header>
              <div
                style="
                  color: white;
                  text-align: center;
                  line-height: 30px;
                  font-family: SourceHanSansSC;
                  font-weight: 400;
                  font-size: 20px;
                  padding-left: 18px;
                "
              >
                Select partition
              </div>
            </template>
            <template #header-extra>
              <svg
                @click="chooseDiskpartVisible = false"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                width="36"
                height="36"
              >
                <defs data-reactroot=""></defs>
                <g>
                  <path
                    d="M38.1421 9.85791L24 24L9.85786 38.1422"
                    stroke="#4E5969"
                    stroke-width="4"
                  ></path>
                  <path
                    d="M9.85787 9.85791L24 24L38.1421 38.1422"
                    stroke="#4E5969"
                    stroke-width="4"
                  ></path>
                </g>
              </svg>
            </template>

            <n-radio-group v-model:value="diskPartition" name="radiogroup">
              <n-space>
                <n-radio
                  v-for="diskPartition in diskPartitionArr"
                  :key="diskPartition.Caption"
                  :value="diskPartition.Caption"
                >
                  {{
                    `${diskPartition.VolumeName}（${diskPartition.Caption}）`
                  }}
                </n-radio>
              </n-space>
            </n-radio-group>

            <template #footer>
              <div
                style="
                  display: flex;
                  justify-content: center;
                  column-gap: 200px;
                "
              >
                <n-button
                  color="rgb(99, 137, 155)"
                  @click="chooseDiskpartVisible = false"
                  >Cancel</n-button
                >
                <n-button
                  color="rgb(99, 137, 155)"
                  :disabled="!diskPartition"
                  @click="confirmChooseDiskpart()"
                  >Define</n-button
                >
              </div>
            </template>
          </n-card>
        </n-modal>

        <Activate
          v-model:visible="visibleRef"
          :uniqueCode="uniqueCode"
          @activate-success="fetchActivateData"
        />
      </n-message-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>
<script setup>
import { provide, reactive, ref, shallowRef, onMounted, nextTick } from "vue";
import PickDir from "./components/PickDir.vue";
import Backtrack from "./components/Backtrack.vue";
import Title from "./components/Title.vue";
import BacktrackRecord from "./components/BacktrackRecord.vue";
import DDNumberAnimation from "./components/DDNumberAnimation.vue";
import { zhCN, dateZhCN, useMessage } from "naive-ui";
import Activate from "./components/Activate.vue";
// import {machineId} from 'node-machine-id'
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import axios from "axios";
import os from "os";
import crypto from "crypto";

const user = ref({});

async function fetchActivateData() {
  spinState.open("activate status...");
  return new Promise((resolve) => {
    setTimeout(() => {
      axios
        .post(
          import.meta.env.VITE_HTTP_HOST + "/client/user/checkActivation/58",
          {
            // axios.post('http://localhost:8063/client/user/checkActivation/58', {
            uniqueCode: uniqueCode.value,
          },
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        )
        .then(function (response) {
          console.log("是否激活", response);
          visibleRef.value = !response.data.data.isActivation;
          if (response.data.data.isActivation) {
            user.value = response.data.data.userInfo;
          }
        })
        .catch(function (error) {
          console.log(error);
        })
        .finally(() => {
          spinState.close();
          resolve();
        });
    }, 2000);
  });
}

/*onMounted(() => {
  // 获取机器唯一标识符
  // machineId().then((id) => {
  //   console.log(id, 'li')
  // })

  FingerprintJS.load()
    .then((fp) => {
      return fp.get();
    })
    .then(async (result) => {
      console.log(result);
      const visitorId = result.visitorId;
      console.log("机器码", visitorId);
      uniqueCode.value = visitorId;
      await nextTick();
      await fetchActivateData();

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
            type: 1, // 启动时
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
});*/

onMounted(async () => {

  const visitorId = await window.electronAPI.generateMachineId();
  console.log("机器码", visitorId);
  uniqueCode.value = visitorId;

  console.log('uniqueCode', uniqueCode.value)
  console.log('uniqueCode', uniqueCode.value)
  console.log('uniqueCode', uniqueCode.value)

  await nextTick();
  await fetchActivateData();

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
            type: 1, // 启动时
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

const contentRef = ref();
const diskPartition = ref();
let uniqueCode = shallowRef();
let visibleRef = shallowRef(false);

const spinState = reactive({
  visible: false,
  message: "",
  open(msg) {
    this.visible = true;
    this.message = msg;
  },
  close() {
    this.visible = false;
    this.message = "";
  },
});

provide("spinState", spinState);

const ddNumberAnimationComponentRef = shallowRef();

const ddNumberAnimationState = reactive({
  diskPartition,
  outDir: "",
  chooseDiskpart() {
    if (ddNumberAnimationComponentRef.value) {
      window.$message.error(
        "A partition backup job is being executed. Wait until the current job is complete"
      );
      return;
    }
    getLogicaldisk("dd");
    // this.start()
  },
  async start() {
    debugger;
    if (ddNumberAnimationComponentRef.value) {
      window.$message.error(
        "A partition backup job is being executed. Wait until the current job is complete"
      );
      return;
    }

    if (!this.outDir) {
      const { canceled, filePaths } = await window.electronAPI.getDDOutDir();
      console.log(canceled, filePaths);
      if (canceled) {
        return;
      }
      this.outDir = filePaths[0];
    }
    ddNumberAnimationComponentRef.value = DDNumberAnimation;
  },
  unmount() {
    console.log("unmountunmountunmountunmount");
    ddNumberAnimationComponentRef.value = null;
  },
});
provide("ddNumberAnimation", ddNumberAnimationState);

const comRef = shallowRef(PickDir);

const chooseDiskpartVisible = ref(false);

const diskPartitionArr = ref([]);

let whyChooseDiskpart = "";

const getLogicaldisk = async (type) => {
  whyChooseDiskpart = type;
  spinState.visible = true;
  spinState.message = "Getting partition information";
  const res = await window.electronAPI.getLogicaldisk();
  diskPartitionArr.value = res;
  spinState.visible = false;
  chooseDiskpartVisible.value = true;
};

const confirmChooseDiskpart = () => {
  chooseDiskpartVisible.value = false;
  if (whyChooseDiskpart === "dd") {
    ddNumberAnimationState.start();
  } else {
    comRef.value = Backtrack;
  }
};

/*const getLogicaldisk = async () => {
  diskPartition.value = 'J:'
  comRef.value = Backtrack
}*/

const openFileDialog = async () => {
  const res = await window.electronAPI.openFileDialog();
  if (res.canceled) {
  } else {
    filePaths.value = res.filePaths;
    comRef.value = Backtrack;
  }
};

const backPick = async () => {
  comRef.value = PickDir;
  diskPartition.value = null;
};

const routing = (component) => {
  comRef.value = component;
};
</script>

<style lang="scss" scoped>
.content {
  position: absolute;
  top: var(--header-height);
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
}

.model {
  color: white;
  background: linear-gradient(
    180deg,
    rgba(128, 194, 213, 1) 0%,
    rgba(130, 201, 219, 0.92) 13%,
    rgba(55, 65, 86, 1) 96%
  );
}
</style>
