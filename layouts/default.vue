<template>
  <div
    class="bg-white text-grey-700 px-4 min-h-screen w-full md:flex md:flex-row"
  >
    <Navbar />
    <slot />
  </div>
</template>

<script setup></script>

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
