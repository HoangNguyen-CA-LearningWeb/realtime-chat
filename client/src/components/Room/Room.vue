<script setup lang="ts">
import { ref } from 'vue';
import Header from '@/components/UI/Header.vue';
import Button from '@/components/UI/Button.vue';
import Chat from './Chat.vue';
import Controls from './Controls.vue';

const message = ref('');

function handleSend() {
  console.log(message.value);
}
</script>
<template>
  <div class="w-1/2 text-white">
    <Header />
    <div class="flex h-96 items-center">
      <Controls room="Javascript" :users="['bob', 'steve']" />
      <Chat />
    </div>
    <div class="flex p-6 bg-blue-900">
      <input class="flex-grow text-black" v-model="message" autofocus />
      <Button @click="handleSend">Send</Button>
    </div>
  </div>
</template>
