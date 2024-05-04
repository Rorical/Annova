<!-- eslint-disable vue/no-v-html -->
<script setup lang="ts">
import { type ChatMessage, MessageFrom } from '@/schema/define'
import { storeToRefs } from 'pinia'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { ref, watch, defineModel } from 'vue'
import { useSettingsStore } from '@/stores/settings'

const settings = useSettingsStore()

const { num_return_sequences } = storeToRefs(settings)

const emit = defineEmits<{
  (event: 'choose', final: number, decision: boolean[]): void
  (event: 'modify', index: number): void
}>()

const messages = defineModel<ChatMessage[]>('messages')

const props = defineProps<{
  selections: ChatMessage[]
  loading: boolean
}>()
const wrapper = ref(0)
const editorVisible = ref(false)

defineExpose({
  wrapper
})

const decision = ref<boolean[]>(new Array(settings.num_return_sequences).fill(false))

watch(num_return_sequences, () => {
  decision.value = new Array(settings.num_return_sequences).fill(false)
})

const submit = (i: number) => {
  console.log('submit', i, decision.value)
  emit('choose', i, decision.value)
  decision.value = new Array(settings.num_return_sequences).fill(false)
}

const decide = (i: number) => {
  decision.value[i] = !decision.value[i]
}

const content = (msg: ChatMessage) => {
  return DOMPurify.sanitize(marked.parse(msg.content) as string)
}

const editorText = ref('')
const editorPointer = ref(0)
const openEditor = (i: number) => {
  editorText.value = messages.value![i].content
  editorPointer.value = i
  editorVisible.value = true
}

watch(editorVisible, () => {
  if (!editorVisible.value) {
    messages.value![editorPointer.value].content = editorText.value
  }
})
</script>

<template>
  <div ref="wrapper" class="wrapper">
    <div
      v-for="(msg, i) in messages"
      :key="i"
      class="message-container"
      @click.right="$emit('modify', i)"
    >
      <div
        class="message"
        :class="{
          user: msg.from === MessageFrom.User,
          actor: msg.from === MessageFrom.Character,
          showMessage: i == messages!.length - 1
        }"
        v-html="content(msg)"
        @contextmenu.prevent="openEditor(i)"
      ></div>
    </div>
    <div
      v-for="(msg, i) in props.selections"
      :key="i"
      class="message-container"
      @click="submit(i)"
      @contextmenu.prevent="decide(i)"
    >
      <div
        class="message actor selection"
        :class="{ decided: decision[i] }"
        v-html="content(msg)"
      ></div>
    </div>
    <a-spinner class="spinner" v-show="loading" />
  </div>
  <a-float v-model:visible="editorVisible" round centered>
    <a-textarea v-model="editorText" placeholder="Type Something..." />
  </a-float>
</template>

<style lang="scss" scoped>
@keyframes show {
  0% {
    opacity: 0;
    transform: translateY(60px);
  }
  100% {
    opacity: 1;
    transform: translateY(0px);
  }
}

.showMessage {
  animation: show 0.5s forwards;
}
.wrapper {
  width: 100%;
  box-sizing: border-box;
  height: 100%;
  padding: {
    bottom: 10px;
    left: 20px;
    right: 20px;
    top: 20px;
  }
  overflow-y: auto;

  .spinner {
    font-size: 40px;
    display: flex;
    justify-content: center;
  }

  .message-container {
    margin-bottom: 15px;
    width: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: center;
    transition: all 0.2s ease-in-out;

    .selection {
      border: {
        bottom-left-radius: 20px !important;
      }

      border: 1px solid var(--secondary) !important;
      background-color: var(--bg-light) !important;
    }

    .decided {
      border: 1px solid rgb(248, 126, 126) !important;
      background-color: var(--bg-active) !important;
    }

    .message {
      user-select: none;
      width: fit-content;
      border: {
        top-left-radius: 20px;
        top-right-radius: 20px;
      }
      max-width: calc(60% - 42px);
      overflow-wrap: break-word;
      overflow: hidden;
      text-align: left;
      padding: {
        left: 20px;
        right: 20px;
        top: 15px;
        bottom: 15px;
      }
      box-shadow: 2px 2px 8px var(--shadow-6);
    }
    .user {
      align-self: flex-end;
      border-bottom-left-radius: 20px;
      background-color: var(--bg-light);
      color: var(--text);
    }
    .actor {
      align-self: flex-start;
      border-bottom-right-radius: 20px;
      background-color: var(--primary-80);
      color: var(--text);
    }
  }
}
</style>
