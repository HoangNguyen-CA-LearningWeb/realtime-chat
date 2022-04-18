<script setup lang="ts">
import type { User } from '@/types';
interface Props {
  user: User;
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
    {{ user.username }} {{ self ? '(Yourself)' : '' }}
  </div>
</template>
