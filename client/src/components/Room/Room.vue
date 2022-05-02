<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import socket from '@/socket';
import Header from '@/components/UI/Header.vue';
import Chat from './Chat.vue';
import Controls from './Controls.vue';
import type { APIUser, Room, Message } from '@/types';
import { authUser } from '@/store/auth';

const users = ref<Room[]>([]);
const room = ref<Room | null>(null);

const initRoom = (user: APIUser): Room => {
  const messages: Message[] = user.messages.map((m) => {
    return {
      user: m.from,
      text: m.content,
      date: new Date(),
    };
  });
  return { ...user, messages, hasNewMessages: false };
};

socket.on('connect', () => {
  users.value.forEach((u) => {
    if (u.username === authUser.value?.username) {
      u.connected = true;
    }
  });
});

socket.on('disconnect', () => {
  users.value.forEach((u) => {
    if (u.username === authUser.value?.username) {
      u.connected = false;
    }
  });
});

socket.on('user connected', (user: APIUser) => {
  const existingUser = users.value.find((u) => u.userID === user.userID);
  if (existingUser) existingUser.connected = true;
  else users.value.push(initRoom(user));
});

socket.on('user disconnected', (id) => {
  const existingUser = users.value.find((u) => u.userID === id);
  if (existingUser) existingUser.connected = false;
});

socket.on('users', (socketUsers: APIUser[]) => {
  users.value = socketUsers
    .map((u) => initRoom(u))
    .sort((a, b) => {
      if (a.username === authUser.value?.username) return -1;
      if (b.username === authUser.value?.username) return 1;
      if (a.username < b.username) return -1;
      return a.username > b.username ? 1 : 0;
    });
});

socket.on('private message', ({ content, from, to }) => {
  for (let i = 0; i < users.value.length; i++) {
    const user = users.value[i];
    const fromSelf = authUser.value?.username === from;
    if (
      (fromSelf && user.userID === to) ||
      (!fromSelf && user.username === from)
    ) {
      user.messages.push({
        user: from,
        text: content,
        date: new Date(),
      });
      if (user !== room.value) {
        user.hasNewMessages = true;
      }
      break;
    }
  }
});

onUnmounted(() => {
  socket.off('connect');
  socket.off('disconnect');
  socket.off('users');
  socket.off('user connected');
  socket.off('user disconnected');
  socket.off('private message');
});

function handleSendMessage(message: string) {
  let auth = authUser.value;
  if (room.value && auth) {
    socket.emit('private message', {
      content: message,
      to: room.value.userID,
    });
    room.value.messages.push({
      user: auth.username,
      text: message,
      date: new Date(),
    });
  }
}
</script>
<template>
  <div class="w-full flex-grow text-white">
    <Header />
    <div class="flex h-full items-center">
      <Controls :users="users" @select-user="(user) => (room = user)" />
      <Chat :room="room" @send-message="handleSendMessage" />
    </div>
  </div>
</template>
