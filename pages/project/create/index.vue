<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <div class="flex flex-col items-start">
      <div class="text-left">
        <h2 class="text-2xl text-grey-700">Start a new project</h2>
        <p class="text-grey-500 font-normal pt-0.5">
          Create a new project to collaborate with your team.
        </p>
      </div>
      <form
        id="profile-information"
        class="flex flex-col items-start mt-6"
        @submit.prevent="saveProjectName"
      >
        <div class="flex flex-col gap-2">
          <input
            type="text"
            minlength="3"
            maxlength="18"
            v-model="setProjectName"
            id="name-field"
            class="border border-grey-100 h-9 w-[380px] placeholder:text-grey-400 pl-3 rounded-lg"
            placeholder="Name of your project"
          />
          <button
            type="submit"
            class="flex flex-row items-center justify-center px-3 h-9 rounded-lg bg-grey-100 hover:bg-grey-200 text-grey-700 transition cursor-pointer"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
// Supabase Connection

import { ref } from "vue";
const setProjectName = ref("");

function saveProjectName() {
  navigateTo(`/project/create/icon?projectName=${setProjectName.value}`);
}

definePageMeta({
  middleware: "auth",
  layout: false,
});
</script>
