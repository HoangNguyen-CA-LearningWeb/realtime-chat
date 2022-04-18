<script setup lang="ts">
import { onUnmounted } from 'vue';
import Lobby from '@/components/Lobby.vue';
import Room from '@/components/Room/Room.vue';
import socket from '@/socket';
import { useAuth } from '@/composables/auth';

socket.on('connect_error', (err) => {
  console.error(err.message);
  if (err.message === 'invalid username') {
    setAuthUser('');
  }
});

onUnmounted(() => {
  socket.off('connect_error');
});

const { setAuthUser } = useAuth();
function handleConnect(username: string) {
  setAuthUser(username);
  socket.auth = { username };
  socket.connect();
}
</script>

<template>
  <div
    class="flex bg-blue-100 h-screen justify-center items-center gap-2 flex-col"
  >
    <Lobby @join="handleConnect" />
    <Room />
  </div>
</template>
