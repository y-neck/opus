<template>
  <div class="flex flex-col w-full">
    <Header pageTitle="Home" />
    <main class="p-16">
      <p>Hello world</p>
    </main>
  </div>
</template>

<script setup>
// Supabase auth
const loading = ref(true);
loading.value = true;
const user = useSupabaseUser();

console.log(user);

import Header from '~/components/Header.vue';

//Page meta
definePageMeta({
  title: 'Home',
  description: '',
  layout: 'default',
});
</script>

<style scoped></style>
