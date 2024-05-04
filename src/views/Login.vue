<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import CONFIG from '@/CONFIG.json'
import { message } from '@any-design/anyui'

const settings = useSettingsStore()
const router = useRouter()

const token = ref('')
const loading = ref(false)

const login = async () => {
  loading.value = true
  settings.setToken(token.value)
  console.log(settings.authToken)
  const response = await fetch(CONFIG.API + '/ping', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + settings.authToken
    }
  })
  if (response.status === 200) {
    await router.push({ name: 'Main' })
  } else {
    message({
      type: 'error',
      content: '登录失败，请检查授权码是否正确'
    })
  }
  loading.value = false
}
</script>

<template>
  <div class="container">
    <div class="info">
      <div class="title">RLHF 数据打标工具</div>
      <p class="sub">请先登录</p>
    </div>
    <div class="form">
      <a-input
        v-model="token"
        placeholder="请输入您的授权码"
        @keydown.enter="login"
        :disabled="loading"
      >
        <template #post-button>
          <a-button type="gradient" @click="login" :loading="loading">登录</a-button>
        </template>
      </a-input>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex-direction: column;

  .info {
    text-align: center;
    .title {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .sub {
      font-size: 16px;
      color: #666;
    }
  }

  .form {
    margin-top: 20px;
    width: 300px;
  }
}
</style>
