<script setup lang="ts">
import { onUnmounted } from 'vue';
import Lobby from '@/components/Lobby.vue';
import Room from '@/components/Room/Room.vue';
import socket from '@/socket';
import { useAuth } from '@/composables/auth';
const { setAuthUser, token } = useAuth();

socket.on('connect_error', (err) => {
  console.error(err.message);
  if (err.message === 'invalid username') {
    setAuthUser('');
  }
});

onUnmounted(() => {
  socket.off('connect_error');
});

async function login(username: string, password: string) {
  try {
    const res = await fetch('/api/users/login', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await res.json();
    localStorage.setItem('token', data.token);
    token.value = data.token;
    setAuthUser(username);
    socket.auth = { token: token.value };
    socket.connect();
  } catch (e) {
    localStorage.removeItem('token');
    console.error(e);
  }
}

function handleConnect(username: string, password: string) {
  login(username, password);
}
</script>

<template>
  <div class="flex bg-blue-100 h-screen items-center flex-col">
    <Lobby @join="handleConnect" />
    <Room />
  </div>
</template>
