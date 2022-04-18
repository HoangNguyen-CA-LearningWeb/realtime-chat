<script setup lang="ts">
import type { Room } from '@/types';
interface Props {
  user: Room;
  self: boolean;
}

defineProps<Props>();
</script>
<template>
  <div
    :class="{
      'w-full p-4 border-b-2': true,
      'cursor-pointer hover:bg-neutral-800': !self,
    }"
  >
    <p>{{ user.username }} {{ self ? '(Yourself)' : '' }}</p>
    <p>{{ user.connected ? 'Connected' : 'Not Connected' }}</p>
  </div>
</template>
