<template>
  <div
    id="page-description"
    class="px-6 pt-2 pb-4 border-b-2 border-grey-100 text-grey-500 flex items-center justify-between"
  >
    <div class="flex items-center gap-1">
      <component :is="pageIcon" class="inline" />
      <!-- Dynamic page icon -->
      <h1>{{ pageTitle }}</h1>
    </div>

    <!-- Slot for additional content -->
    <div>
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
//Page meta
const props = defineProps<{ pageTitle: string; pageIcon: string }>();
</script>

<style scoped></style>
