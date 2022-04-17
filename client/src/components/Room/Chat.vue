<script setup lang="ts">
import type { Message } from '@/types';
interface Props {
  messages: Message[];
}
defineProps<Props>();
</script>

<template>
  <div class="bg-neutral-300 flex-grow h-full p-6 space-y-4">
    <div v-for="message in messages" class="bg-white text-black p-2 rounded">
      <p class="text-lg">
        {{ message.user }}
        <span class="text-neutral-500 text-sm">{{
          message.date.toLocaleDateString()
        }}</span>
      </p>
      {{ message.text }}
    </div>
  </div>
</template>
