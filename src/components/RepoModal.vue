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
            letter-spacing: 16px;
            line-height: 30px;
            font-family: SourceHanSansSC;
            font-weight: 400;
            font-size: 20px;
            padding-left: 18px;
            font-family: SourceHanSansSC-regular;
          "
        ></div>
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
      <div class="form-box" ref="formBoxRef">
        <n-form
          ref="formRef"
          :model="repoModel"
          label-placement="left"
          label-width="auto"
          require-mark-placement="right-hanging"
        >
          <n-form-item label="Name of  evidence：">
            {{ repoModel.name }}
          </n-form-item>

          <!-- <n-form-item label="Evidence type：">
            {{ repoModel.type === '违规占道' ? 'Illegal traffic occupation' : repoModel.type }}
          </n-form-item> -->

          <n-form-item label="Authentication Time:">
            {{ moment(repoModel.time).format("YYYY-MM-DD") }}
          </n-form-item>

          <n-form-item label="Certificator：">
            {{ repoModel.operator }}
          </n-form-item>

          <n-form-item label="Other information：">
            {{ repoModel.otherInformation }}
          </n-form-item>

<!--          <n-form-item label="Evidence list："> </n-form-item>-->
          <div class="evidence-list">Evidence list：</div>
          <n-data-table
            :bordered="false"
            :single-line="false"
            :columns="columns"
            :data="repoModel.videoList"
          />
        </n-form>
      </div>
      </n-scrollbar>

      <!--      <div>
        <div style="color: white; text-align: center; letter-spacing: 16px; line-height: 30px; font-family: SourceHanSansSC;
          font-weight: 400;
          font-size: 20px;
          padding-left: 18px;
          font-family: SourceHanSansSC-regular;"
        >固证报告</div>
        <div style="font-family: SourceHanSansSC;
            font-weight: 700;
            font-size: 20px;
            color: rgb(255, 255, 255);
            font-style: normal;
            letter-spacing: 0;
            line-height: 29px;
        ">
          <div>固证名称：${data.name}</div>
          <div>固证类型：${data.type}</div>
          <div>固证时间：${moment(data.time).format('YYYY-MM-DD hh:mm:ss')}</div>
          <div>操作人员：${data.operator}</div>
          <div>其他信息：${data.otherInformation}</div>
          <div>视频列表：</div>
          <div>
            <table style="border: 1px solid black; border-collapse: collapse; width: 100%">
              <tr style="border: 1px solid black;">
                <th style="border: 1px solid black;">视频名称</th>
                <th style="border: 1px solid black;">时长</th>
                <th style="border: 1px solid black;">大小</th>
                <th style="border: 1px solid black;">状态</th>
                <th style="border: 1px solid black;">校验信息</th>
              </tr>
              <tr style="border: 1px solid black;">
                <td style="border: 1px solid black;">asdfa</td>
                <td style="border: 1px solid black;">sdfas</td>
                <td style="border: 1px solid black;">asdf</td>
                <td style="border: 1px solid black;">asdf</td>
                <td style="border: 1px solid black;">asdf</td>
              </tr>
            </table>
          </div>
        </div>
      </div>-->

      <template #footer>
        <div style="display: flex; justify-content: center; column-gap: 200px">
          <n-button v-if="btn" color="rgb(99, 137, 155)" @click="exportPdf"
            >Export Report</n-button
          >
          <n-button color="rgb(99, 137, 155)" @click="modalVisible = false"
            >Close</n-button
          >
        </div>
      </template>
    </n-card>
  </n-modal>
</template>

<!--<script setup>

import {reactive, ref, toRefs} from "vue";

// const modalVisible = ref(false)
const state = reactive({
  modalVisible: false
})

setTimeout(() => {
  state.modalVisible = true
  console.log(state)
}, 2000)
</script>-->

<script>
import {
  inject,
  reactive,
  ref,
  toRaw,
  toRefs,
  watch,
  watchEffect,
  h,
} from "vue";
import moment from "moment";
import { formatDuration, formatSize } from "./common";
import cg from "../assets/回溯结果/3Copy3@1x.png";
import xf from "../assets/回溯结果/4Copy@1x.png";

export default {
  props: {
    id: Number,
    btn: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const state = reactive({
      modalVisible: false,
      repoModel: {},
    });

    const spinState = inject("spinState");
    const formBoxRef = ref();

    console.log("props.id", props.id);
    watch(
      () => props.id,
      (newVal, oldVal) => {
        window.electronAPI.selectById(props.id).then((res) => {
          console.log(res);
          res.videoList = JSON.parse(res.videoList);
          state.repoModel = res;
        });
      }
    );

    const exportPdf = async () => {
      spinState.visible = true;
      spinState.message = "Exporting file";
      console.log(state.repoModel);
      console.log(toRaw(state.repoModel));
      window.electronAPI.onExportProgress((v) => {
        spinState.message = v;
      });
      // await window.electronAPI.exportPdf(toRaw(state.repoModel))
      try {
        await window.electronAPI.exportPdf([toRaw(state.repoModel)]);
        spinState.visible = false;
        spinState.message = "";
      } catch (error) {
        // 取消导出
        spinState.visible = false;
        spinState.message = "";
      }
    };

    const imgSrc = "../assets/回溯结果/群组 3 Copy 3@1x.png";

    // 返回值会暴露给模板和其他的选项式 API 钩子
    return {
      ...toRefs(state),
      moment,
      formatDuration,
      formatSize,
      exportPdf,
      formBoxRef,
      columns: [
        {
          title: "Video name",
          key: "name",
          width: 150,
          ellipsis: {
            tooltip: true,
          },
        },
        {
          title: "Duration",
          key: "duration",
          render({ duration }) {
            return formatDuration(duration);
          },
        },
        {
          title: "Video size",
          key: "size",
          render({ size }) {
            return formatSize(size);
          },
        },
        /*{
          title: "state",
          key: "state",
          render({ state }) {
            /!*return h(
                'img',
                {
                  src: empty,
                  height: 20,
                  width: 20
                })*!/

            return h(
              "div",
              {
                style: {
                  display: "flex",
                },
              },
              [
                state === "常规" ? "convention" : "damage",
                h("img", {
                  src: state === "常规" ? cg : state === "修复" ? xf : "",
                  height: 20,
                  width: 20,
                }),
              ]
            );
          },
        },*/
        {
          title: "Check information",
          key: "hash",
          width: 100,
          ellipsis: {
            tooltip: true,
          },
        },
      ],
    };
  },
  mounted() {},
};
</script>

<style scoped>
.model {
  color: white;
  opacity: 0.9;
  background: linear-gradient(
    180deg,
    rgba(128, 194, 213, 1) 0%,
    rgba(130, 201, 219, 0.92) 13%,
    rgba(55, 65, 86, 1) 96%
  );
}

.form-box .n-form-item :deep(.n-form-item-label) {
  /*--n-label-text-color: red;*/
  font-family: SourceHanSansSC;
  font-weight: 700;
  font-size: 20px;
  color: rgb(255, 255, 255);
  font-style: normal;
  letter-spacing: 0;
  line-height: 29px;
}


.form-box .n-form-item :deep(.n-form-item-blank) {
  /*--n-label-text-color: red;*/
  color: rgba(255, 255, 255, 1);
  font-size: 20px;
  text-align: left;
  font-family: SourceHanSansSC-bold;
  font-weight: 700;
}


.evidence-list {
  font-family: SourceHanSansSC;
  font-weight: 700;
  font-size: 20px;
  color: rgb(255, 255, 255);
  font-style: normal;
  letter-spacing: 0;
  line-height: 29px;
}
</style>
