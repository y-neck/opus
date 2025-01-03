<template>
  <header class="mb-16 z-10">
    <div
      id="page-description"
      class="px-6 h-[3.75rem] border-b border-l border-grey-100 text-grey-500 flex items-center justify-between -mr-7 fixed header-width bg-white"
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
  </header>
</template>

<script setup lang="ts">
//Page meta
const props = defineProps<{ pageTitle: string; pageIcon: string }>();
</script>

<style scoped>
.header-width {
  width: 85.42%;
}
</style>
