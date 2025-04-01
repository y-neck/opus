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
import { ref } from "vue";
import Header from "~/components/layout/Header.vue";
import TaskList from "~/components/project/tasks/TaskList.vue";

const isAddSectionModalOpen = ref(false);

const openAddSectionModal = () => {
  isAddSectionModalOpen.value = true;
};

const closeAddSectionModal = () => {
  isAddSectionModalOpen.value = false;
};

definePageMeta({
  middleware: "auth",
  layout: "default",
});

useSeoMeta({
  title: "Opus · Tasks",
  ogTitle: "Tasks",
  ogSiteName: "opus",
  ogType: "website",
  description:
    "Change your profile picture, update your email address, and more!",
  ogDescription:
    "Change your profile picture, update your email address, and more!",
  creator: "https://github.com/y-neck/ | https://github.com/kevinschaerer/",
  robots: "noindex, nofollow",
  ogImage: "",
});
</script>
