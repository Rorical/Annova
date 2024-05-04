import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { GenerationConfig } from '@/schema/define'

export const useSettingsStore = defineStore('setting', {
  state: () => ({
    max_tokens: 512,
    temperaturex: 1,
    top_p: 1,
    top_k: 50,
    num_return_sequences: 4,
    token: ""
  }),
  getters: {
    maxTokens(state) {
      return state.max_tokens
    },
    temperature(state) {
      return state.temperaturex
    },
    topP(state) {
      return state.top_p
    },
    topK(state) {
      return state.top_k
    },
    numReturnSequences(state) {
      return state.num_return_sequences
    },
    all(state): GenerationConfig {
      return {
        max_tokens: state.max_tokens,
        temperature: state.temperaturex,
        top_p: state.top_p,
        top_k: state.top_k,
        num_return_sequences: state.num_return_sequences
      }
    },
    authToken(state) {
      return state.token
    }
  },
  actions: {
    setMaxTokens(value: number) {
      this.max_tokens = value
    },
    setTemperature(value: number) {
      this.temperaturex = value
    },
    setTopP(value: number) {
      this.top_p = value
    },
    setTopK(value: number) {
      this.top_k = value
    },
    setNumReturnSequences(value: number) {
      this.num_return_sequences = value
    },
    setAll(settings: GenerationConfig) {
      this.max_tokens = settings.max_tokens
      this.temperaturex = settings.temperature
      this.top_p = settings.top_p
      this.top_k = settings.top_k
      this.num_return_sequences = settings.num_return_sequences
    },
    setToken(value: string) {
      this.token = value
    }
  }
})
