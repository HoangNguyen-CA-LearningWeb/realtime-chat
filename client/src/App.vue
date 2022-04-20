<script setup lang="ts">
import { onUnmounted, onMounted } from 'vue';
import Lobby from '@/components/Lobby.vue';
import Room from '@/components/Room/Room.vue';
import socket from '@/socket';
import { login, clearAuthUser, loadUser } from '@/store/auth';

socket.on('connect_error', (err) => {
  console.error(err.message);
  if (err.message === 'invalid username') {
    clearAuthUser();
  }
});

onMounted(async () => {
  const token = await loadUser();
  if (token) {
    socket.auth = { token };
    socket.connect();
  }
});

onUnmounted(() => {
  socket.off('connect_error');
});

async function handleConnect(username: string, password: string) {
  const token = await login(username, password);
  socket.auth = { token };
  socket.connect();
}
</script>

<template>
  <div class="flex bg-blue-100 h-screen items-center flex-col">
    <Lobby @join="handleConnect" />
    <Room />
  </div>
</template>
