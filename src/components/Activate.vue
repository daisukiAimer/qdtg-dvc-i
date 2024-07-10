<template>
  <n-modal v-model:show="modalVisible" :mask-closable="false">
    <div class="model-box">
      <img src="../assets/index/Frame30.png" height="572" width="572" />
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
              line-height: 40px;
              font-family: SourceHanSansSC;
              font-weight: 400;
              font-size: 24px;
            "
          >
            MTM-Video Forensics for Removable Devices
          </div>
        </template>
        <div class="form-box">
          <n-form
            ref="formRef"
            :model="model"
            label-placement="left"
            label-width="auto"
            require-mark-placement="right-hanging"
          >
            <n-form-item
              label="UserName："
              path="username"
              :rule="{
                required: true,
                message: 'please enter username',
                trigger: ['input', 'blur'],
              }"
            >
              <n-input
                v-model:value="model.username"
                placeholder="please enter"
              />
            </n-form-item>

            <n-form-item
              label="Password："
              path="password"
              :rule="{
                required: true,
                message: 'please enter the password',
                trigger: ['input', 'blur'],
              }"
            >
              <n-input
                v-model:value="model.password"
                placeholder="please enter"
              />
            </n-form-item>

<!--            <n-form-item
              label="Email："
              path="email"
              :rule="{
                required: true,
                message: 'please enter your email address',
                trigger: ['input', 'blur'],
              }"
            >
              <n-input v-model:value="model.email" placeholder="please enter" />
            </n-form-item>-->

            <n-form-item
                label="Email："
                :validation-status="mailValidationStatus"
                :feedback="mailFeedback"
            >
              <n-input v-model:value="model.email" placeholder="please enter" />
            </n-form-item>

            <n-form-item class="verification">
              <n-button
                  :loading="sending"
                  :disabled="mailValidationStatus || sending || sendCountdown || !model.username"
                  color="rgba(51, 65, 51, 100)"
                  @click="sendVerificationCode"
              >Send verification code {{ sendCountdown ? sendCountdown : ''}}</n-button>
            </n-form-item>


            <n-form-item
                label="Verification code："
                path="emailCode"
                :rule="{
                required: true,
                message: 'please enter your verification code',
                trigger: ['input', 'blur'],
              }"
            >
              <n-input v-model:value="model.emailCode" placeholder="please enter" />

            </n-form-item>


            <n-form-item
              label="Country："
              path="country"
              :rule="{
                required: true,
                message: 'please select a country',
                trigger: ['input', 'blur'],
              }"
            >
              <n-select
                v-model:value="model.country"
                :options="model.options"
              />
            </n-form-item>

            <n-form-item label="Enterprise or organization：" path="unit">
              <n-input v-model:value="model.unit" placeholder="please enter" />
            </n-form-item>
          </n-form>
        </div>

        <template #footer>
          <div
            style="display: flex; justify-content: center; column-gap: 200px"
          >
            <n-button
              style="width: 180px"
              color="rgb(99, 137, 155)"
              @click="insertRecord"
              >Activation</n-button
            >
          </div>
        </template>
      </n-card>
    </div>
  </n-modal>
</template>

<script setup>
import { computed, reactive, toRaw, ref, inject, onMounted, watch } from "vue";
import { useMessage } from "naive-ui";
import axios from "axios";

onMounted(() => {
  console.log("机器码", props.uniqueCode);
  axios
    .get(import.meta.env.VITE_HTTP_HOST + "/client/user/getCountryList/en")
    // axios.get('http://localhost:8063/client/user/getCountryList/en')
    .then((response) => {
      // 处理成功情况
      console.log("国家", response);
      let arr = [];
      response.data.data.forEach((item) => {
        arr.push({ label: item, value: item });
      });
      model.options = arr;
    })
    .catch((error) => {
      // 处理错误情况
      console.log(error);
    });
});

const props = defineProps({
  visible: true,
  uniqueCode: "",
});

const formRef = ref("");

const model = reactive({
  uniqueCode: "123",
  username: "",
  password: "",
  email: "",
  country: "China",
  unit: "",
  productVersionld: 24,
  emailCode: '',
  options: [
    {
      label: "China",
      value: "China",
    },
  ],
});

const emit = defineEmits(["update:visible", "activate-success"]);

const modalVisible = computed({
  get() {
    return props.visible;
  },
  set(visible) {
    emit("update:visible", visible);
  },
});

const message = useMessage();
const insertRecord = async () => {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      axios
        .post(
          import.meta.env.VITE_HTTP_HOST + "/client/user/onlineActivation/58",
          {
            // axios.post('http://localhost:8063/client/user/onlineActivation/58', {
            uniqueCode: props.uniqueCode,
            username: model.username,
            password: model.password,
            email: model.email,
            country: model.country,
            unit: model.unit,
            productVersionId: model.productVersionld,
            emailCode: model.emailCode,
          },
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        )
        .then(function (response) {
          console.log("激活信息", response);
          if (response.data.code === 500) {
            window.$message.error(response.data.msg);
          } else {
            emit("activate-success");
            modalVisible.value = false;
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      console.log(errors);
    }
  });
};

const sending = ref(false)
const sendCountdown = ref(0)

const sendVerificationCode = () => {
  sending.value = true
  axios.post(
          import.meta.env.VITE_HTTP_HOST + "/client/user/sendMailCode",
          {
            // axios.post('http://localhost:8063/client/user/onlineActivation/58', {
            email: model.email,
            username: model.username
          },
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
      )
      .then(function (response) {
        console.log("验证码", response);
        if (response.data.code === 500) {
          window.$message.error(response.data.msg);
        } else {
          sendCountdown.value = 60
          let interval = setInterval(() => {
            sendCountdown.value = sendCountdown.value - 1
            if (!sendCountdown.value) {
              clearInterval(interval);
            }
          }, 1000);

        }
      })
      .catch(function (error) {
        console.log(error);
      }).finally(() => {
    sending.value = false
  });
}


const emailRegex =/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
const mailValidationStatus = computed(() => {
  // const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  // const emailRegex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
  console.log('mailValidationStatus', emailRegex.test(model.email))
  return emailRegex.test(model.email) ? undefined : 'error'
})

const mailFeedback = computed(() => {
  console.log('mailFeedback', emailRegex.test(model.email) ? undefined : 'Please enter a valid email address')
  return emailRegex.test(model.email) ? undefined : 'Please enter a valid email address'
})


</script>

<style scoped>
.model-box {
  width: 100%;
  height: 800px;
  padding-top: 64px;
  background: linear-gradient(
    180deg,
    rgba(128, 194, 213, 1) 0%,
    rgba(130, 201, 219, 0.92) 13%,
    rgba(55, 65, 86, 1) 96%
  );
  box-sizing: border-box;
}

.model-box > img {
  position: absolute;
  z-index: 1;
  top: 20%;
  left: 5%;
  width: 400px;
  height: 400px;
}


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

  width: 640px !important;
  height: 560px;
  margin: 60px 0 0 300px;
  border: none;
  box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.4);
}

.model :deep(.n-card__content) {
  flex-grow: 0;
  padding: 40px 100px 20px;
}

.form-box {
  font-size: 20px;
}

/*.form-box .n-form-item .n-form-item-label {*/
.form-box .n-form-item :deep(.n-form-item-label) {
  /*--n-label-text-color: red;*/
  font-family: SourceHanSansSC;
  font-size: 20px;
  color: rgb(255, 255, 255);
  font-style: normal;
  letter-spacing: 0;
  line-height: 29px;
}


.verification :deep(.n-form-item-blank) {
  justify-content: right;
}
</style>
