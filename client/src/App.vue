<script setup lang="ts">
import { ref } from 'vue';
import Lobby from '@/components/Lobby.vue';
import Room from '@/components/Room/Room.vue';
import type { Message } from '@/types';
import { io } from 'socket.io-client';

const messages = ref<Message[]>([
  { user: 'bob', text: 'HELLO!', date: new Date() },
  { user: 'steve', text: 'HELLO!', date: new Date() },
]);
</script>

<template>
  <div
    class="flex bg-blue-100 h-screen justify-center items-center gap-2 flex-col"
  >
    <Lobby />
    <Room :messages="messages" />
  </div>
</template>
