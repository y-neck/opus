<template>
  <div
    id="page-description"
    class="px-6 h-[3.75rem] border-b border-grey-100 text-grey-500 flex items-center justify-between -mr-7"
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
