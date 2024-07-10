<template>
  <n-modal v-model:show="showComputed" :mask-closable="false">
    <n-card
      style="width: 700px"
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
            /*letter-spacing: 16px;*/
            line-height: 30px;
            font-family: SourceHanSansSC;
            font-weight: 400;
            font-size: 20px;
            padding-left: 18px;
          "
        >
          <slot name="title"></slot>
        </div>
      </template>
      <template #header-extra>
        <svg
          @click="showComputed = false"
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

      <slot></slot>

      <template #footer>
        <div style="display: flex; justify-content: center; column-gap: 200px">
          <slot name="footer"></slot>
        </div>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup>
import { reactive, toRefs, defineProps, computed } from "vue";

const props = defineProps({
  show: false,
  "onUpdate:show": Function,
  "update:show": Function,
});

const emit = defineEmits(["update:show"]);

const showComputed = computed({
  get() {
    return props.show;
  },
  set(show) {
    emit("update:show", show);
  },
});

/*const state = reactive({
  modalVisible: true
})
const { modalVisible } = toRefs(state)*/
</script>

<style scoped>
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
