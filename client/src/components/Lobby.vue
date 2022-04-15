<script setup lang="ts">
import Header from '@/components/UI/Header.vue';
import Button from '@/components/UI/Button.vue';

function handleSubmit() {
  console.log('Submit');
}
</script>
<template>
  <div class="w-1/2 text-white">
    <Header />
    <div class="bg-blue-700 p-5">
      <form @submit.prevent="handleSubmit">
        <label
          >Room:
          <select class="text-black block">
            <option selected disabled hidden value="">Select Room</option>
            <option value="javascript">Javascript</option>
          </select>
        </label>
        <Button type="button">Join Room</Button>
      </form>
    </div>
  </div>
</template>
