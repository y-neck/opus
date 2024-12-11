<template>
  <div class="flex flex-col w-full">
    <Header pageTitle="Index" pageIcon="LayoutGridIcon" />
    <main class="p-16">
      <p>Coming soon</p>
    </main>
  </div>
</template>

<script setup>
import { supabaseConnection } from '~/composables/supabaseConnection';
import Header from '~/components/Header.vue';

//Page meta
definePageMeta({
  title: 'Home',
  description: '',
  middleware: 'auth',
  layout: 'default',
});
</script>

<style scoped></style>
