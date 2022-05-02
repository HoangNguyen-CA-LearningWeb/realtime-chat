<script setup lang="ts">
import type { Room } from '@/types';
import RoomUser from './RoomUser.vue';
import { authUser, clearAuthUser } from '@/store/auth';

interface Props {
  users: Room[];
}
defineProps<Props>();
const emit = defineEmits(['selectUser']);
</script>

<template>
  <div
    class="bg-stone-700 h-full w-52border text-neutral-300 text-lg border-r-2"
  >
    <p class="p-4 border-b-2">Direct Messages</p>
    <RoomUser
      v-for="user in users"
      :user="user"
      :self="user.username === authUser?.username"
      @click="emit('selectUser', user)"
    />
    <button @click="clearAuthUser">Logout</button>
  </div>
</template>
