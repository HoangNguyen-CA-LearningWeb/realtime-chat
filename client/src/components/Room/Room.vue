<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import socket from '@/socket';
import Header from '@/components/UI/Header.vue';
import Chat from './Chat.vue';
import Controls from './Controls.vue';
import type { User, Room } from '@/types';
import { getAuthUser } from '@/store/auth';

const users = ref<Room[]>([]);
const room = ref<Room | null>(null);

const initRoom = (user: User): Room => {
  return { ...user, messages: [], hasNewMessages: false };
};

socket.on('connect', () => {
  users.value.forEach((u) => {
    if (u.username === getAuthUser()?.username) {
      u.connected = true;
    }
  });
});

socket.on('disconnect', () => {
  users.value.forEach((u) => {
    if (u.username === getAuthUser()?.username) {
      u.connected = false;
    }
  });
});

socket.on('users', (socketUsers: User[]) => {
  users.value = socketUsers
    .map((u) => initRoom(u))
    .sort((a, b) => {
      if (a.username === getAuthUser()?.username) return -1;
      if (b.username === getAuthUser()?.username) return 1;
      if (a.username < b.username) return -1;
      return a.username > b.username ? 1 : 0;
    });
});

socket.on('user connected', (user: User) => {
  const existingUser = users.value.find((u) => u.userID === user.userID);
  if (existingUser) existingUser.connected = true;
  else users.value.push(initRoom(user));
});

socket.on('user disconnected', (id) => {
  const existingUser = users.value.find((u) => u.userID === id);
  if (existingUser) existingUser.connected = false;
});

socket.on('private message', ({ content, from, to }) => {
  // TODO: FIX BUG!, sending message from steve to harvey, other instance of steve doesn't not get message in correct room, must account for [to] variable!
  for (let i = 0; i < users.value.length; i++) {
    const user = users.value[i];
    if (user.userID === from) {
      user.messages.push({
        user: user.username,
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
  let auth = getAuthUser();
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
