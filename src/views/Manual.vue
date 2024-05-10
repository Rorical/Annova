<script setup lang="ts">
import Chat from '@/components/Chat.vue'
import { Crosshair, SwitchHorizontal } from '@vicons/tabler'
import { Icon } from '@vicons/utils'
import { useSettingsStore } from '@/stores/settings'
import { nextTick, onMounted, ref } from 'vue'
import { message as messageBox } from '@any-design/anyui'
import {
  type ChatMessage,
  type GenerationRequest,
  MessageFrom,
  type PersonaInfo
} from '@/schema/define'
import CONFIG from '@/CONFIG.json'

const settings = useSettingsStore()
const session = ref<PersonaInfo | null>(null)
const message = ref('')
const messages = ref<ChatMessage[]>([])

const chatBox = ref<any>(null)

const isMeFirst = ref(true)

const keepBottom = (smooth = true) => {
  nextTick(() => {
    chatBox.value.wrapper.scrollBy({
      top: chatBox.value.wrapper.scrollHeight,
      left: 0,
      behavior: smooth ? 'smooth' : 'auto'
    })
  })
}

const init = async () => {
  messages.value = []
  ///api/prompt
  const response = await fetch(CONFIG.API + '/api/prompt', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + settings.authToken
    }
  })
  session.value = await response.json()
  messages.value = []

  keepBottom(false)
}

const send = () => {
  let from = isMeFirst.value ? MessageFrom.Character : MessageFrom.User
  if (messages.value.length % 2 === 0) {
    from = isMeFirst.value ? MessageFrom.User : MessageFrom.Character
  }

  messages.value.push({
    from,
    content: message.value
  })
  keepBottom()
  message.value = ''
}

const submit = async () => {
  if (messages.value.length === 0) {
    messageBox({
      type: 'error',
      content: '请先输入内容'
    })
    return
  }
  await fetch(CONFIG.API + '/api/sft_collect', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + settings.authToken
    },
    body: JSON.stringify({
      persona: session.value!.id!,
      history: messages.value
    })
  })
  messages.value = []
  messageBox({
    type: 'success',
    content: '提交成功'
  })
  keepBottom()
}

onMounted(async () => {
  await init()
})
</script>

<template>
  <div class="chat-container">
    <div class="chat-wrapper" v-if="session">
      <div class="prompt-window">
        <div class="prompt">
          <div class="prompt-text">
            <div class="prompt-title">{{ session?.name }}</div>
            <div class="prompt-content">
              <p>{{ session?.description }}</p>
            </div>
          </div>
        </div>
        <div class="prompt-footer">
          <a-button type="" size="small" round @click="init">Restart</a-button>
          <a-button type="normal" size="small" round @click="isMeFirst = !isMeFirst">
            <Icon><SwitchHorizontal /></Icon> {{ isMeFirst ? '我' : 'AI' }}先
          </a-button>
          <a-button type="gradient" size="small" round @click="submit">
            <Icon><Crosshair /></Icon> 提交
          </a-button>
        </div>
      </div>
      <div class="chat-main">
        <div class="chat-box">
          <Chat ref="chatBox"
          v-model:messages="messages"
          :loading="false"
          :selections="[]"></Chat>
        </div>
        <div class="chat-input">
          <a-input v-model="message" placeholder="Type Something..." round @keyup.enter="send">
            <template #post-button>
              <a-button type="gradient" size="small" round :disabled="message == ''" @click="send"
                ><Icon><Send /></Icon> Send</a-button
              >
            </template>
          </a-input>
        </div>
      </div>
    </div>
    <div v-else class="loading">
      <a-spinner class="spinner" />
      <p>只是加载一下...</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.chat-container {
  height: 100vh;
  width: 100%;
  box-sizing: border-box;
  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    flex-direction: column;
    font-size: 32px;
    user-select: none;

    .spinner {
      font-size: 74px;
      margin-bottom: 20px;
    }
  }

  .chat-wrapper {
    display: flex;
    flex-direction: row;
    height: 100%;

    .prompt-window {
      display: flex;
      flex-direction: column;
      min-width: 300px;
      flex-grow: 0;
      height: 100%;
      background-color: var(--bg-readonly);
      max-width: 390px;

      .prompt {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 20px;
        .prompt-text {
          display: flex;
          flex-direction: column;
          height: 100%;
          .prompt-title {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 10px;
          }
          .prompt-content {
            font-size: 14px;
            line-height: 1.5;
            color: var(--text-secondary);
            white-space: pre-wrap;
            overflow: auto;
            max-height: 80vh;
          }
        }
      }
      .prompt-footer {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        height: 50px;
        background-color: var(--bg-readonly);
        padding-bottom: 15px;
        gap: 10px;
      }
    }
    .chat-main {
      display: flex;
      flex-direction: column;
      height: 100%;
      flex-grow: 1;
    }
  }

  .chat-info {
    align-self: flex-start;
    width: 100%;
    height: 50px;
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: nowrap;
    justify-content: space-between;
    background-color: var(--bg-readonly);
    .character-info {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      height: 100%;
      width: max-content;
      margin-left: 25px;

      .name {
        font-weight: 600;
        font-size: 18px;
        margin: 8px 0 12px;
        user-select: none;
      }

      .others {
        font-size: 9px;
        padding-top: 6px;
        margin-left: 5px;
      }
    }

    .options {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100%;
      width: max-content;
      margin-right: 30px;
      user-select: none;
      .xicon {
        transform: scale(1.6);
      }
    }
  }

  .chat-box {
    width: 100%;
    align-self: center;
    flex: auto;
    height: 0;
    position: relative;

    &::before {
      position: absolute;
      content: '';
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: 17px;
      backdrop-filter: blur(10px);
      z-index: 10;
      background: linear-gradient(to top, var(--bg), rgba(0, 0, 0, 0));
    }
  }
  .chat-input {
    align-self: flex-end;
    z-index: 5;
    width: 100%;
    padding: {
      bottom: 15px;
      left: 14px;
      right: 16px;
      top: 0px;
    }
    box-sizing: border-box;
    backdrop-filter: blur(8px);
  }
}
</style>
