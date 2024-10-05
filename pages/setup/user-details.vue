<template>
  <SetupPage />
</template>

<script setup>
import { supabaseConnection } from '~/composables/supabaseConnection';

definePageMeta({
  title: 'Registration',
  description: '',
  middleware: 'auth',
  layout: false,
});
</script>

<style scoped></style>
