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
  <div class="bg-stone-700 flex-grow h-full">
    <template v-if="room">
      <div class="border-b-2 p-4 text-xl">
        {{ room.username }}
      </div>
      <div v-for="message in room.messages" class="p-4 hover:bg-stone-800">
        <p class="text-lg">
          {{ message.user }}
          <span class="text-neutral-400 text-sm">{{
            message.date.toLocaleDateString()
          }}</span>
        </p>
        {{ message.text }}
      </div>
      <form
        class="flex bg-stone-800 m-4 text-black"
        @submit.prevent="emit('sendMessage', message)"
      >
        <input class="flex-grow" v-model="message" autofocus />
        <Button>Send</Button>
      </form></template
    >
  </div>
</template>
