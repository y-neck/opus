<template>
  <div
    id="page-description"
    class="px-6 pt-2 pb-4 border-b-2 border-grey-100 text-grey-500 flex items-center gap-1"
  >
    <component :is="pageIcon" class="inline"/>
    <!-- Dynamic page icon -->
    <span>{{ pageTitle }}</span>
  </div>
</template>

<script setup lang="ts">
//Page meta
const props = defineProps<{ pageTitle: string; pageIcon: string }>();
</script>

<style scoped></style>
