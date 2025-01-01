<template>
  <div class="mb-16 last:mb-0">
    <div class="flex justify-between items-center">
      <div class="flex flex-row items-center gap-3">
        <h1
          class="text-2xl mb-1"
          :style="{ color: sectionNames[sectionId]?.color || '#3F3F46' }"
        >
          {{ sectionNames[sectionId]?.title || "Untitled Section" }}
        </h1>
        <div
          class="flex items-center justify-center h-[18px] w-[18px] bg-grey-100 rounded font-semiBold"
        >
          <p class="text-xs">{{ tasks.length }}</p>
        </div>
      </div>
      <span
        class="w-5 h-5 flex justify-center items-center rounded cursor-pointer hover:bg-grey-100 active:text-grey-950 text-grey-500 transition"
      >
        <DotsIcon />
      </span>
    </div>
    <hr class="border-grey-100" />
    <div v-if="tasks.length > 0">
      <Task v-for="task in tasks" :key="task.id" :task="task" />
      <div
        class="flex flex-row gap-2 items-center text-grey-500 pt-2 cursor-pointer max-w-24"
      >
        <span><PlusIcon /></span>
        <p>Add Task</p>
      </div>
    </div>

    <div v-else>
      <p>No tasks available in this section.</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import Task from "./Task.vue"; // Import the Task component

defineProps({
  sectionId: String,
  tasks: Array,
  sectionNames: Object,
});
</script>
