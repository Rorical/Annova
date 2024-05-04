<script setup lang="ts">
import {useRouter} from "vue-router";

const router = useRouter()

</script>

<template>
  <div class="container">
    <div class="info">
      <div class="title">无限进化协议</div>
      <p class="sub">初始化成功... 等待指令</p>
    </div>
    <div class="jump-container">
      <a-card title="交互式进化系统" :width="280" @click="router.push({name: 'Interactive'})">
        <p>在AI的回复之中，选择最有价值的那个</p>
        <template #footer>
          <p>DPO 数据标注</p>
        </template>
      </a-card>

      <a-card title="手动辅助系统" :width="280" @click="router.push({name: 'Manual'})">
        <p>通过示例教会AI如何说话</p>
        <template #footer>
          <p>SFT 数据标注</p>
        </template>
      </a-card>

      <a-card title="数据填充系统" :width="280" @click="router.push({name: 'Prompt'})">
        <p>将预先定义的人格放入储备</p>
        <template #footer>
          <p>Prompt 工程</p>
        </template>
      </a-card>
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
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;

    .title {
      font-size: 24px;
      font-weight: bold;
    }

    .sub {
      font-size: 16px;
      color: #666;
    }
  }

  .jump-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 20px;

    .a-card {
      // hover effect
      transition: transform 0.2s;
      &:hover {
        transform: scale(1.02) translateY(-5px);
      }
    }
  }
}

</style>
