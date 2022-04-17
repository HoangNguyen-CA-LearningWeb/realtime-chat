<script setup lang="ts">
interface Props {
  room: string;
  users: string[];
}
defineProps<Props>();
</script>

<template>
  <div class="bg-blue-600 h-full p-6">
    <h2 class="font-bold">Room Name</h2>
    <span>{{ room }}</span>
    <h2 class="font-bold">Users:</h2>
    <div v-for="user in users">{{ user }}</div>
  </div>
</template>
