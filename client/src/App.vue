<script setup lang="ts">
import { onUnmounted, onMounted } from 'vue';
import Lobby from '@/components/Lobby.vue';
import Room from '@/components/Room/Room.vue';
import socket from '@/socket';
import { login, clearAuthUser, loadUser, authUser } from '@/store/auth';

socket.on('connect_error', (err) => {
  if (err.message === 'authentication failed') {
    clearAuthUser();
  }
});

onUnmounted(() => {
  socket.off('connect_error');
});

onMounted(async () => {
  const token = await loadUser();
  if (token) {
    socket.auth = { token };
    socket.connect();
  }
});

async function handleConnect(username: string, password: string) {
  const token = await login(username, password);
  if (token) {
    socket.auth = { token };
    socket.connect();
  }
}
</script>

<template>
  <div class="flex bg-blue-100 h-screen items-center flex-col">
    <Lobby @join="handleConnect" v-if="!authUser" />
    <Room v-else />
  </div>
</template>
