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
          Evidence Authentication Information Sheet
        </div>
      </template>
      <template #header-extra>
        <svg
            @click="modalVisible = false"
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
      <n-scrollbar style="max-height: 500px">
        <div class="form-box">
          <n-form
              ref="formRef"
              :model="model"
              label-placement="left"
              label-width="auto"
              require-mark-placement="right-hanging"
          >
            <n-form-item
                label="Name of  evidence："
                path="name"
                :rule="{
              required: true,
              message: 'please enter',
              trigger: ['input', 'blur'],
            }"
            >
              <n-input v-model:value="model.name" placeholder="please enter"/>
            </n-form-item>

            <n-form-item
                label="Authentication Time:"
                path="time"
                :rule="{
              type: 'number',
              required: true,
              message: 'please enter',
              trigger: ['change', 'blur'],
            }"
            >
              <n-date-picker
                  style="width: 100%"
                  v-model:value="model.time"
                  type="datetime"
                  :default-value="Date.now()"
                  :disabled="true"
                  placeholder="please enter"
              />
            </n-form-item>

            <n-form-item
                label="Certificator："
                path="operator"
                :rule="{
              required: true,
              message: 'please enter',
              trigger: ['input', 'blur'],
            }"
            >
              <n-input
                  v-model:value="model.operator"
                  placeholder="please enter"
              />
            </n-form-item>

<!--            <n-form-item
                label="Authentication equipment："
                path="device"
                :rule="{
              required: true,
              message: 'please enter',
              trigger: ['input', 'blur'],
            }"
            >
              <n-input v-model:value="model.device" placeholder="please enter"/>
            </n-form-item>-->

            <!--          <n-form-item label="固证设备：" path="device">
              <n-upload
                  abstract
                  action="uploadFile://uploadDeviceImage"
                  accept="image/*"
                  multiple
              >
                <div style="display: flex; flex-direction: column;  width: 100%">
                  <div style="display: flex; flex-direction: row; column-gap: 10px;">
                    <n-input v-model:value="model.device"/>
                    <n-upload-trigger #="{ handleClick }" abstract>
                      <n-button @click="handleClick">
                        上传
                      </n-button>
                    </n-upload-trigger>
                  </div>
                  <div>
                    <n-card style="margin-top: 12px">
                      <n-upload-file-list />
                    </n-card>
                  </div>
                </div>
              </n-upload>
            </n-form-item>-->

            <n-form-item label="Other information：" path="otherInformation">
              <n-input v-model:value="model.otherInformation" type="textarea"/>
            </n-form-item>
          </n-form>
        </div>
      </n-scrollbar>

      <!--      {{ resources }}-->
      <!--      {{ model }}-->

      <template #footer>
        <div style="display: flex; justify-content: center; column-gap: 200px">
          <n-button color="rgb(99, 137, 155)" @click="cancelInsertRecord"
          >cancel
          </n-button
          >
          <n-button color="rgb(99, 137, 155)" @click="insertRecord"
          >define
          </n-button
          >
        </div>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup>
import {computed, reactive, toRaw, ref, inject} from "vue";
import {useMessage} from "naive-ui";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import axios from "axios";

const props = defineProps({
  visible: false,
  resources: [],
  changeModal: Function,
});

const formRef = ref("");

const spinState = inject("spinState");

const options = [
  {
    label: "Illegal traffic occupation",
    value: "Illegal traffic occupation",
  },
];

const model = reactive({
  name: "",
  type: "Illegal traffic occupation",
  time: Date.now(),
  operator: "",
  device: "",
  otherInformation: "",
  videoList: [
    {
      name: "test.mp4",
      duration: "",
      size: "",
      state: "",
      hash: "",
    },
  ],
});

window.electronAPI.getDeviceInfo().then(res => {
  model.device = res
});

const emit = defineEmits(["update:visible"]);

const modalVisible = computed({
  get() {
    return props.visible;
  },
  set(visible) {
    emit("update:visible", visible);
  },
});

const cancelInsertRecord = () => {
  /*(model.name = ""),
      (model.time = Date.now()),
      (model.operator = ""),
      (model.device = ""),
      (model.otherInformation = ""),*/
      // model.value = {
      //   name: "",
      //   type: "Illegal traffic occupation",
      //   time: Date.now(),
      //   operator: "",
      //   device: "",
      //   otherInformation: "",
      //   videoList: [
      //     {
      //       name: "test.mp4",
      //       duration: "",
      //       size: "",
      //       state: "",
      //       hash: "",
      //     },
      //   ],
      // };
      (modalVisible.value = false);
};

const message = useMessage();
const insertRecord = async () => {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      spinState.open("Solid symptoms are developing...");
      const arr = toRaw(props.resources)
          .filter((item) => item.checked)
          .map((item) => {
            return {
              path: item.metadata?.format.filename,
              name: item.filename,
              duration: item.metadata?.format?.duration,
              size: item.metadata?.format?.size,
              state: item.fileState,
              hash: "",
            };
          });

      for (const item of arr) {
        item.hash = await window.electronAPI.getFileHash(item.path);
      }
      model.videoList = arr;
      const modelRaw = toRaw(model);
      // message.success('验证成功')
      const res = await window.electronAPI.insertRecord(modelRaw);

      props.changeModal(res.lastID);

      model.name = ""
      model.time = Date.now()
      model.operator = ""
      model.device = ""
      model.otherInformation = ""

      /*for (let i = 0; i < 100; i++) {
        const res = await window.electronAPI.insertRecord(modelRaw)
      }*/

      // const dd = await window.electronAPI.dd()
      // spinState.visible = false
      spinState.close();

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
                      type: 4, // 导出固证成功时
                      uniqueCode: visitorId,
                      timezone: timezone,
                      operateTime: operateTime,
                    },
                    {
                      headers: {"Content-Type": "multipart/form-data"},
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
                  type: 4, // 关闭时
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
    } else {
      console.log(errors);
    }
  });
  // await window.electronAPI.insertRecord(toRaw(model))
};
</script>

<style scoped>
.model {
  /*background-color: rgb(83, 110, 131);*/
  /*background-color: rgb(130, 196, 214);*/
  color: white;
  /*opacity: .9;*/
  /*background-image: linear-gradient(rgb(128, 195, 214), rgb(55, 65, 86));*/
  /*background: linear-gradient(#80C2D5, #82C9DB 92%, #374156 100%);*/
  /*background-image: linear-gradient(rgb(128, 194, 213), rgb(130, 201, 219) 92%, rgb(55, 65, 86) 100%);*/
  background: linear-gradient(
      180deg,
      rgba(128, 194, 213, 1) 0%,
      rgba(130, 201, 219, 0.92) 13%,
      rgba(55, 65, 86, 1) 96%
  );
}

.form-box {
  font-size: 20px;
  width: 100%;
}

/*.form-box .n-form-item .n-form-item-label {*/
.form-box .n-form-item :deep(.n-form-item-label) {
  /*--n-label-text-color: red;*/
  font-family: SourceHanSansSC;
  font-weight: 700;
  font-size: 16px;
  color: rgb(255, 255, 255);
  font-style: normal;
  letter-spacing: 0;
  line-height: 29px;
}
</style>
