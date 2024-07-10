<template>
  <div class="box" ref="boxRef">
    <div class="item" v-for="(repoData, index) in resources">
      <div @click="clickItem(repoData)">
        <img src="../assets/固证记录/history@1x.png" height="179" width="176" />
        <div style="text-align: center">{{ repoData.name }}</div>
      </div>
      <!-- <n-checkbox class="item-select" v-model:checked="repoData.checked" size="large"></n-checkbox> -->
    </div>
  </div>

  <repoModal
    ref="repoModalRef"
    :to="boxRef"
    :id="repoTargetIdRef"
    :btn="false"
  />
</template>

<script setup>
import { ref } from "vue";
import RepoModal from "./RepoModal.vue";

const props = defineProps({
  resources: [],
});

const repoModalRef = ref("");
const repoTargetIdRef = ref();
const boxRef = ref();

const clickItem = (repoData) => {
  console.log(repoData);
  repoTargetIdRef.value = repoData.id;
  repoModalRef.value.modalVisible = true;
};
</script>

<style scoped>
.box {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, 200px);
  justify-content: center;
  grid-row-gap: 30px;
}

.item {
  display: flex;
  flex-direction: column;
  place-items: center;
  padding: 10px;
  cursor: pointer;
  position: relative;
}

.item-select {
  z-index: 999;
  position: absolute;
  top: 10px;
  left: 10px;
  visibility: hidden;
}

.item:hover .item-select {
  visibility: unset;
}

.item :deep(.n-checkbox--checked) {
  visibility: unset;
}
</style>
