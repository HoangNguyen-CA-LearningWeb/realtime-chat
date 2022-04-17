<script setup lang="ts">
import Lobby from '@/components/Lobby.vue';
import Room from '@/components/Room/Room.vue';
import { io } from 'socket.io-client';
</script>

<template>
  <div
    class="flex bg-blue-100 h-screen justify-center items-center gap-2 flex-col"
  >
    <Lobby />
    <Room />
  </div>
</template>
