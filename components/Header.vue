<template>
  <div
    id="page-description"
    class="px-6 pt-2 pb-4 border-b-2 border-grey-100 text-grey-500 flex gap-1"
  >
    <img src="" alt="icn" />
    <p>{{ pageTitle }}</p>
  </div>
</template>

<script setup lang="ts">
//Page meta
const props = defineProps<{ pageTitle }>();
</script>

<style scoped></style>
