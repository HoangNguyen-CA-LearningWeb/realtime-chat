<script setup lang="ts">
import { ref } from 'vue';
import Button from '@/components/UI/Button.vue';
import type { Room } from '@/types';
interface Props {
  room: Room | null;
}
defineProps<Props>();
const emit = defineEmits(['sendMessage']);

const message = ref('');
</script>

<template>
  <div class="bg-neutral-300 flex-grow h-full space-y-4 text-black">
    <template v-if="room">
      <div class="border p-4 text-xl">
        {{ room.username }}
      </div>
      <div v-for="message in room.messages" class="bg-white p-2 rounded">
        <p class="text-lg">
          {{ message.user }}
          <span class="text-neutral-500 text-sm">{{
            message.date.toLocaleDateString()
          }}</span>
        </p>
        {{ message.text }}
      </div>
      <form
        class="flex p-6 bg-blue-900"
        @submit.prevent="emit('sendMessage', message)"
      >
        <input class="flex-grow" v-model="message" autofocus />
        <Button>Send</Button>
      </form></template
    >
  </div>
</template>
