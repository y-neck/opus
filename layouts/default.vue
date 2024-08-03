<template>
  <Header />
  <div class="bg-white text-grey-700 px-4 h-screen md:flex md:flex-row">
    <Navbar />
    <main class="p-16"><slot /></main>
  </div>
</template>

<script setup>
import Header from '~/components/Header.vue';
</script>

<style scoped>
/* :root {
  --white: #fff;
  --text: #000;
}

div {
  background-color: --white;
  color: var(--text);
  padding: 16px;
  height: 100vh;
} */
</style>
