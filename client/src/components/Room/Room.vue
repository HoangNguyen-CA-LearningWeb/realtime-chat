<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import Header from '@/components/UI/Header.vue';
import Button from '@/components/UI/Button.vue';
import Chat from './Chat.vue';
import Controls from './Controls.vue';
import type { Message, User } from '@/types';
import { useAuth } from '@/composables/auth';
import socket from '@/socket';
interface Props {
  messages: Message[];
}
defineProps<Props>();

const { authUser } = useAuth();
const users = ref<User[]>([]);
socket.on('users', (socketUsers: User[]) => {
  users.value = socketUsers;
  users.value = users.value.sort((a, b) => {
    if (a.username < b.username) return -1;
    else return -1;
  });
});

socket.on('user connected', (user: User) => {
  users.value.push(user);
});

onUnmounted(() => {
  socket.off('users');
  socket.off('user connected');
});

const message = ref('');
function handleSend() {}
</script>
<template>
  <div class="w-1/2 text-white">
    <Header />
    <div class="flex h-96 items-center">
      <Controls :users="users" />
      <Chat :messages="messages" />
    </div>
    <div class="flex p-6 bg-blue-900">
      <input class="flex-grow text-black" v-model="message" autofocus />
      <Button @click="handleSend">Send</Button>
    </div>
  </div>
</template>
