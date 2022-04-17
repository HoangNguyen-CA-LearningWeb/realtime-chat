<script setup lang="ts">
import type { User } from '@/types';
interface Props {
  users: User[];
}
defineProps<Props>();
</script>

<template>
  <div class="bg-blue-600 h-full p-6">
    <h2 class="font-bold">Users:</h2>
    <div v-for="user in users">{{ user.username }}</div>
  </div>
</template>
