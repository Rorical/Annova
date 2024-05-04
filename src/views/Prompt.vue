<script setup lang="ts">
import { defineProps, ref } from 'vue'
import type { PersonaInfo } from '@/schema/define'
import { type Form, message } from '@any-design/anyui'

const form = ref<InstanceType<typeof Form> | undefined>(undefined)
const data = ref<PersonaInfo>({
  name: '',
  description: ''
})
const rules = {
  name: [{ required: true, message: '请输入名字' }],
  description: [{ required: true, message: '请输入描述' }]
}

const submit = async () => {
  if (!(await form?.value?.validate())) {
    message({
      type: 'error',
      content: '请检查输入'
    })
    return
  }
  await fetch('/api/prompt', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      persona: data.value
    })
  })
  message({
    type: 'success',
    content: '提交成功'
  })
  data.value = {
    name: '',
    description: ''
  }
}
</script>

<template>
  <div class="container">
    <a-form ref="form" v-model="data" :rules="rules" class="form">
      <a-form-item prop="text">
        <a-input v-model="data.name" borderless placeholder="名字"></a-input>
      </a-form-item>
      <a-form-item prop="text">
        <a-textarea
          :maxRows="21"
          :minRows="21"
          autoMatchHeight
          borderless
          v-model="data.description"
          placeholder="描述：请尽可能详细"
        ></a-textarea>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="submit">提交</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;

  .form {
    width: 60%;
  }
}
</style>
