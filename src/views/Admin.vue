<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import { message } from '@any-design/anyui'
import CONFIG from '@/CONFIG.json'
import {useSettingsStore} from "@/stores/settings";
import {AdminMode as Mode, type PromptReview, type SFTReview} from "@/schema/define";
import {Icon} from "@vicons/utils";
import {Refresh} from "@vicons/tabler";

const settings = useSettingsStore()

const mode = ref<Mode>(Mode.Prompt)

const data = ref<PromptReview | SFTReview | null>(null)
const loadReviewPrompt = async () => {
  const response = await fetch(CONFIG.API + '/api/admin/review/prompt', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + settings.authToken
    }
  })
  data.value = await response.json()
}

const sendPromptReview = async (reject: boolean) => {
  let url = CONFIG.API + '/api/admin/review/prompt/approve/' + (data.value as PromptReview).id
  if (reject) {
    url = CONFIG.API + '/api/admin/review/prompt/reject/' + (data.value as PromptReview).id
  }
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + settings.authToken
    }
  })
  if (response.ok) {
    message({
      type: 'success',
      content: 'Review sent'
    })
  } else {
    message({
      type: 'error',
      content: 'Failed to send review'
    })
  }
}

const loadReviewSFT = async () => {
  const response = await fetch(CONFIG.API + '/api/admin/review/sft', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + settings.authToken
    }
  })
  data.value = await response.json()
}

const sendSFTReview = async (reject: boolean) => {
  let url = CONFIG.API + '/api/admin/review/sft/approve/' + (data.value as SFTReview).id
  if (reject) {
    url = CONFIG.API + '/api/admin/review/sft/reject/' + (data.value as SFTReview).id
  }
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + settings.authToken
    }
  })
  if (response.ok) {
    message({
      type: 'success',
      content: 'Review sent'
    })
  } else {
    message({
      type: 'error',
      content: 'Failed to send review'
    })
  }
}

const sendReview = async (reject: boolean) => {
  switch (mode.value) {
    case Mode.Prompt:
      await sendPromptReview(reject)
      break
    case Mode.SFT:
      await sendSFTReview(reject)
      break
  }
  await load()
}

const load = async () => {
  switch (mode.value) {
    case Mode.Prompt:
      await loadReviewPrompt()
      break
    case Mode.SFT:
      await loadReviewSFT()
      break
  }

}

const switchMode = async () => {
  switch (mode.value) {
    case Mode.Prompt:
      mode.value = Mode.SFT
      break
    case Mode.SFT:
      mode.value = Mode.Prompt
      break
  }
  await load()
}

const showMode = computed(() => {
  switch (mode.value) {
    case Mode.Prompt:
      return 'Prompt'
    case Mode.SFT:
      return 'SFT'
  }
})

const dataAsSftMessage = computed(() => {
  return (data.value as SFTReview).history.map((item) => {
    return {
      role: item.from == 0 ? 'target' : 'self',
      content: item.content,
      id: `${Date.now()}_${Math.random()}`
    }
  })
})

onMounted(async () => {
  await load()
})
</script>

<template>
<div class="wrapper a-card">
  <div class="container">
    <template v-if="data">
      <div class="prompt-card" v-if="mode == Mode.Prompt">
        <h3>{{ (data as PromptReview).name }}</h3>
        <p>{{ (data as PromptReview).description }}</p>
      </div>
      <div class="sft-card" v-else-if="mode == Mode.SFT">
        <div class="info-block">
          <h3>{{ (data as SFTReview).persona.name }}</h3>
          <p>{{ (data as SFTReview).persona.description }} </p>
        </div>
        <a-chat :messages="dataAsSftMessage"></a-chat>
      </div>
    </template>
    <template v-else>
      <p>喵喵喵，这里什么都没有了喵~</p>
    </template>
    <div class="buttons">
      <a-button type="primary" @click="sendReview(false)" v-if="data">Accept</a-button>
      <a-button type="gradient" size="small" round @click="switchMode"><Icon><Refresh /></Icon> {{ showMode }}</a-button>
      <a-button type="danger" @click="sendReview(true)" v-if="data">Reject</a-button>
    </div>
  </div>

</div>
</template>

<style scoped lang="scss">
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  align-content: center;
  flex-direction: column;

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    border-radius: 10px;
    width: 40%;
    max-height: 100%;

    .buttons {
      margin-top: 15px;
      display: flex;
      justify-content: space-around;
      width: 100%;
    }

    .prompt-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      text-wrap: normal;
      white-space: pre-wrap;
    }

    .sft-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      text-wrap: normal;
      white-space: pre-wrap;

      .info-block {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 10px;
        text-wrap: normal;
        white-space: pre-wrap;

        h3 {
          margin: 0;
        }

        p {
          margin: 0;
          max-height: 5rem;
          overflow-y: scroll;
        }
      }

      .a-chat {
        max-height: 70vh;
        width: 100%;
        min-width: 570px;
        background-color: var(--bg-active);
        padding: 10px;
        border-radius: 10px;
      }
    }
  }

}
</style>