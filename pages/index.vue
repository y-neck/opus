<template>
  <div class="flex flex-col">
    <Navbar />
    <div><p>Hello world</p></div>
  </div>
</template>

<script setup>
import Navbar from '~/ components/Navbar.vue';

definePageMeta({
  title: 'Home',
  description: '',
  layout: 'default',
});
</script>

<style scoped></style>
