<template>
  <div class="flex flex-col w-full">
    <Header :pageTitle="'Tasks'" :pageIcon="'NoteIcon'">
      <template #actions>
        <div class="flex flex-row gap-3">
          <button
            class="flex flex-row items-center px-3 py-2 rounded hover:bg-gray-100"
            @click="openAddSectionModal"
          >
            <LayoutGridIcon class="mr-2 h-4 w-4" />
            <span>Section</span>
          </button>
        </div>
      </template>
    </Header>
    <main class="p-16 w-full">
      <TaskList
        :isAddSectionModalOpen="isAddSectionModalOpen"
        @closeAddSectionModal="closeAddSectionModal"
      />
    </main>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import Header from "~/components/layout/Header.vue";
import TaskList from "~/components/project/tasks/TaskList.vue";

const isAddSectionModalOpen = ref(false);

watch(isAddSectionModalOpen, (newValue) => {
  console.log("Tasks.vue - Modal state changed:", newValue);
});

const openAddSectionModal = () => {
  console.log("Tasks.vue - Opening modal button clicked");
  isAddSectionModalOpen.value = true;
  console.log(
    "Tasks.vue - Modal state after opening:",
    isAddSectionModalOpen.value
  );
};

const closeAddSectionModal = () => {
  console.log("Tasks.vue - Closing modal");
  isAddSectionModalOpen.value = false;
  console.log(
    "Tasks.vue - Modal state after closing:",
    isAddSectionModalOpen.value
  );
};

// Log initial state
console.log("Tasks.vue - Initial modal state:", isAddSectionModalOpen.value);

definePageMeta({
  middleware: "auth",
  layout: "default",
});
</script>
