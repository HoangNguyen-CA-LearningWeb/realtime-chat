<script setup lang="ts">
import { ref } from 'vue';
import Header from '@/components/UI/Header.vue';
import Button from '@/components/UI/Button.vue';

const emit = defineEmits(['join']);

const username = ref('steve');
const password = ref('password');
</script>
<template>
  <div class="w-full text-white">
    <Header />
    <div class="bg-stone-700 p-5">
      <form @submit.prevent="emit('join', username, password)">
        <label
          >Username:
          <input v-model="username" type="text" class="text-black block" />
        </label>
        <label
          >Password:
          <input v-model="password" type="password" class="text-black block" />
        </label>

        <Button type="submit">Join Room</Button>
      </form>
    </div>
  </div>
</template>
