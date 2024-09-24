<template>
  <div class="flex flex-col w-full">
    <Header pageTitle="Tasks" pageIcon="NoteIcon" />
    <main class="p-16">
      <div v-for="project in projectTasks" :key="project.projectId">
        <div class="task-section-container pb-16">
          <div
            class="section-header flex items-center gap-4 border-b-2 border-b-grey-100"
            v-for="(section, index) in project.taskSections"
            :key="index"
          >
            <h2
              class="task-section-title text-2xl"
              :style="{ color: `hsl(${generateRandomHue(index)}, 25%, 60%)` }"
            >
              <!-- :style: random hsl color for each h2 title -->
              {{ section }}
            </h2>
            <p
              class="project-task-count text-grey-700 text-xs font-semibold p-1 w-4 bg-grey-100 rounded"
            >
              {{ project.tasks.length }}
            </p>
          </div>
          <div
            v-for="task in project.tasks"
            :key="task.id"
            class="task-container flex items-center align-top gap-2 p-4 h-16 w-full border-b-2 border-b-grey-100"
          >
            <input
              class="task-checkbox w-4 h-4 border-grey-700"
              type="checkbox"
              :name="`check-task-${task.id}`"
              :id="`task-${task.id}`"
            />

            <div class="task-info">
              <p class="task-property-title" :id="`task-${task.name}`">
                {{ task.name }}
              </p>
              <div class="task-property-description flex text-grey-500 gap-1">
                <p class="task-property-dueDate">{{ task.dueDate || 'NaN' }}</p>
                <span class="divider">·</span>
                <p class="task-property-assignee">{{ task.assignedTo }}</p>
              </div>
            </div>
            <div class="task-edit-actions flex justify-self-end gap-1">
              <button class="edit-task-btn"><PencilIcon /></button>
              <button class="context-menu-btn"><DotsIcon /></button>
              <!-- TODO: Add functionality to btns -->
            </div>
          </div>
          <button class="add-task-btn text-grey-500">+ Add Task</button>
          <!-- TODO: Add functionality to btn -->
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// Supabase auth
const loading = ref(true);
loading.value = true;
const user = useSupabaseUser();

console.log(user);

import Header from '~/components/Header.vue';

// Db logic
import projectTasks from '~/server/models/tasksETL';

//Page meta
definePageMeta({
  title: 'Tasks',
  description: '',
  layout: 'default',
});

// Random hue for h2 titles
const generateRandomHue = (index: number) => {
  return Math.floor(Math.random() * 360);
};
</script>

<style scoped>
:root {
  --randomHue: ${Math.floor(Math.random() * 360)};
}

.task-section-title {
  color: hsl(var(--randomHue), 20%, 50%);
}
</style>
