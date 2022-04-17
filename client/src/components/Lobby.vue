<script setup lang="ts">
import { ref } from 'vue';
import Header from '@/components/UI/Header.vue';
import Button from '@/components/UI/Button.vue';

const emit = defineEmits(['join']);

const username = ref('');

function handleSubmit() {
  emit('join', username.value);
}
</script>
<template>
  <div class="w-1/2 text-white">
    <Header />
    <div class="bg-blue-700 p-5">
      <form @submit.prevent="handleSubmit">
        <label
          >Username:
          <input v-model="username" class="text-black block" />
        </label>
        <label
          >Room:
          <select class="text-black block">
            <option selected disabled hidden value="">Select Room</option>
            <option value="javascript">Javascript</option>
          </select>
        </label>
        <Button type="submit">Join Room</Button>
      </form>
    </div>
  </div>
</template>
