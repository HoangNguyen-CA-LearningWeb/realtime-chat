<script setup lang="ts">
import type { Room } from '@/types';
import RoomUser from './RoomUser.vue';
import { useAuth } from '@/composables/auth';
const { authUser } = useAuth();

interface Props {
  users: Room[];
}
defineProps<Props>();
const emit = defineEmits(['selectUser']);
</script>

<template>
  <div class="bg-blue-600 h-full w-52">
    <RoomUser
      v-for="user in users"
      :user="user"
      :self="user.username === authUser"
      @click="emit('selectUser', user)"
    />
  </div>
</template>
