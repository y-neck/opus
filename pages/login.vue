<template>
    <div class="flex flex-col">
      <input type="email">
      <input type="password">
      <button>Login</button>
      <p>Forgotten your password?</p>
      <p>Create Account</p>
      <InboxIcon />
    </div>
  </template>
  
  <script setup>
  
  definePageMeta({
    title: 'Home',
    description: '',
    layout: false,
  });
  </script>
  
  <style scoped></style>