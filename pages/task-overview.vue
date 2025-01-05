<template>
  <div class="flex flex-col w-full">
    <Header page-title="Task Overview" page-icon="NotepadIcon" />
    <OverviewList />
  </div>
</template>

<script setup>
import Header from "~/components/layout/Header.vue";
import OverviewList from "~/components/project/overview/OverviewList.vue";

definePageMeta({
  middleware: "auth",
  layout: "default",
});
</script>
