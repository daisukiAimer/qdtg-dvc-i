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
        <div class="header" style="">Export failure</div>
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

<!--      <div class="text">Please confirm that the TF card is connected</div>-->
      <div class="text">The video is damaged and cannot be exported/authenticated.</div>

      <template #footer>
        <div style="display: flex; justify-content: center; column-gap: 200px">
          <n-button @click="modalVisible = false" color="rgb(99, 137, 155)"
            >Close</n-button
          >
        </div>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup>
import { reactive, toRefs } from "vue";

const state = reactive({
  modalVisible: false,
});

const { modalVisible } = toRefs(state);
</script>

<style scoped>
.model {
  width: 680px;
  height: 400px;
  line-height: 20px;
  color: rgba(16, 16, 16, 1);
  background: linear-gradient(
    180deg,
    rgba(128, 194, 213, 1) 0%,
    rgba(130, 201, 219, 0.92) 13%,
    rgba(55, 65, 86, 1) 96%
  );
  font-size: 14px;
  text-align: center;
  font-family: Roboto;
  border: 1px solid rgba(255, 255, 255, 1);
}

.header {
  color: white;
  text-align: center;
  //letter-spacing: 16px;
  line-height: 30px;
  font-weight: 400;
  padding-left: 18px;
  color: rgba(255, 255, 255, 1);
  font-size: 26px;
  font-family: SourceHanSansSC-regular;
}

.text {
  color: rgba(255, 255, 255, 1);
  font-size: 28px;
  text-align: center;
  letter-spacing: 2px;
  height: 40px;
  font-family: SourceHanSansSC-regular;
  margin: auto 0;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
