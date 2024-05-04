<script setup lang="ts">
import { type GenerationRequest } from '@/schema/define'
import { ref } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { message } from '@any-design/anyui'

const settings = useSettingsStore()
const maxTokens = ref(settings.maxTokens.toString())
const temperature = ref(settings.temperature.toString())
const topP = ref(settings.topP.toString())
const topK = ref(settings.topK.toString())
const numReturnSequences = ref(settings.numReturnSequences.toString())

const save = () => {
  const maxTokensNum = parseInt(maxTokens.value.trim())
  const temperatureNum = parseFloat(temperature.value.trim())
  const topPNum = parseFloat(topP.value.trim())
  const topKNum = parseInt(topK.value.trim())
  const numReturnSequencesNum = parseInt(numReturnSequences.value.trim())

  if (maxTokensNum < 1 || maxTokensNum > 1024) {
    message({
      type: 'error',
      content: 'Max Tokens must be between 1 and 1024'
    })
    return
  }
  if (temperatureNum < 0 || temperatureNum > 1) {
    message({
      type: 'error',
      content: 'Temperature must be between 0 and 1'
    })
    return
  }
  if (topPNum < 0 || topPNum > 1) {
    message({
      type: 'error',
      content: 'Top P must be between 0 and 1'
    })
    return
  }
  if (topKNum < 1 || topKNum > 100) {
    message({
      type: 'error',
      content: 'Top K must be between 1 and 100'
    })
    return
  }
  if (numReturnSequencesNum < 2 || numReturnSequencesNum > 5) {
    message({
      type: 'error',
      content: 'Num Return Sequences must be between 2 and 5'
    })
    return
  }
  settings.setAll({
    max_tokens: maxTokensNum,
    temperature: temperatureNum,
    top_p: topPNum,
    top_k: topKNum,
    num_return_sequences: numReturnSequencesNum
  })
  message({
    type: 'success',
    content: 'Settings Saved'
  })
}
</script>

<template>
  <div class="settings">
    <h1>Settings</h1>
    <div class="a-form-item">
      <p class="label">Max Tokens</p>
      <a-input v-model="maxTokens" />
    </div>
    <div class="a-form-item">
      <p class="label">Temperature</p>
      <a-input v-model="temperature" />
    </div>
    <div class="a-form-item">
      <p class="label">Top P</p>
      <a-input v-model="topP" />
    </div>
    <div class="a-form-item">
      <p class="label">Top K</p>
      <a-input v-model="topK" />
    </div>
    <div class="a-form-item">
      <p class="label">Num Return Sequences</p>
      <a-input v-model="numReturnSequences" />
    </div>
    <div class="a-form-item">
      <a-button @click="save">Save</a-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.settings {
  .label {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }
}
</style>
