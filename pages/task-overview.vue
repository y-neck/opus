<template>
  <div class="flex flex-col w-full">
    <Header pageTitle="Task Overview" pageIcon="NotepadIcon" />
    <main class="p-16">
      <div v-for="project in projectTasks">
        <div id="project-tasks-container w-full mb-16">
          <div
            class="section-header flex items-center gap-4 border-b-2 border-b-grey-100"
          >
            <h2 class="project-title text-2xl font-medium text-grey-500">
              {{ project.projectName }}
            </h2>
            <p
              class="project-task-count text-grey-700 text-xs font-semibold p-1 w-4 bg-grey-100 rounded"
            >
              {{
                project.taskSections.reduce(
                  (total, section) => total + section.tasks.length,
                  0
                )
              }}
            </p>
          </div>
          <div v-for="section in project.taskSections" :key="section.index">
            <div class="taskList" v-for="task in section.tasks" :key="task.id">
              <div class="task py-4 border-b-2 border-b-grey-100">
                <span class="task-name text-grey-950">{{ task.name }}</span>
                <div class="task-properties flex gap-1 text-grey-500">
                  <span class="task-property-due">{{
                    `${task.dueDate.day}.${task.dueDate.month}.${task.dueDate.year}`
                  }}</span>
                  <span class="divider">·</span>
                  <span class="task-property-project">
                    {{ project.projectName }}
                  </span>
                  <span class="divider">·</span
                  ><span class="task-property-assignees">{{
                    task.assignedTo.join(', ')
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
// Supabase auth
const loading = ref(true);
loading.value = true;
const user = useSupabaseUser();

console.log(user);

import Header from '~/components/Header.vue';

//Db logic
import projectTasks from '~/server/models/tasksETL';

//Page meta
definePageMeta({
  title: 'Task Overview',
  description: '',
  layout: 'default',
});
</script>

<style scoped></style>
