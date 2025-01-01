<template>
  <Header :pageTitle="'Tasks'" :pageIcon="'NoteIcon'">
    <template #actions>
      <div class="flex flex-row gap-3">
        <button class="flex flex-row">
          <span class="mt-1 mr-1"><LayoutGridIcon /></span>
          Section
        </button>
      </div>
    </template>
  </Header>
  <main class="p-16 w-full">
    <TaskList />
  </main>
</template>

<script setup>
import Header from "~/components/layout/Header.vue";
import TaskList from "~/components/project/tasks/TaskList.vue";
</script>
