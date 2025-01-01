<template>
  <div class="flex flex-col w-full">
    <Header pageTitle="Task Overview" pageIcon="NotepadIcon" />
    <main class="p-16 flex flex-col">
      <!-- Loop over each project -->
      <div
        v-for="(project, projectIndex) in projects"
        :key="project.projectId"
        class="task-section-container flex flex-col mb-8"
      >
        <!-- Task Section Header and Task Count -->
        <h2
          class="task-project-title text-2xl"
          :style="{
            color: `hsl(${generateRandomHue(projectIndex)}, 25%, 60%)`,
          }"
        >
          {{ project.projectName }}
        </h2>
        <!-- Loop over each task section -->
        <div
          v-for="(section, sectionIndex) in [
            ...(project.taskSections ?? []),
            ...(project.unsectionedTasks?.length
              ? [unsectionedSection(project.unsectionedTasks)]
              : []),
          ]"
          :key="sectionIndex"
          class="task-section-container flex flex-col gap-2 border-b-2 border-b-grey-100"
        >
          <!-- Type-cast combined array; ?? []: if null, return empty array -->
          <div class="task-section-header flex items-center gap-2">
            <h3 class="task-section-title text-xl">
              {{ section.name }}
            </h3>
            <p
              class="project-task-count text-grey-700 text-xs font-semibold p-1 w-4 bg-grey-100 rounded"
            >
              {{ section.tasks.length }}
            </p>
          </div>
          <!-- Tasks within each section -->
          <div
            v-for="task in section.tasks"
            :key="task.id"
            class="task-container group flex items-center gap-2 p-4 h-16 w-full border-b-2 border-b-grey-100"
          >
            <div
              class="task-info flex flex-row gap-2 align-baseline items-center"
            >
              <div class="task-properties">
                <p class="task-property-title" :id="`task-${task.id}`">
                  {{ task.name }}
                </p>
                <div class="task-property-description flex text-grey-500 gap-1">
                  <p class="task-property-dueDate">
                    {{
                      task.dueDate
                        ? `${task.dueDate.day}.${task.dueDate.month}.${task.dueDate.year}`
                        : "NaN"
                    }}
                  </p>
                  <span class="divider">·</span>
                  <p class="task-property-assignee">
                    {{ task.assignedTo }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// Supabase Connection
import Header from "~/components/Header.vue";

import { getProjects } from "~/middleware/projectMiddleware";
const projects = await getProjects();

// Page meta
definePageMeta({
  title: "Task Overview",
  description: "",
  middleware: "auth",
  layout: "default",
});
useSeoMeta({
  title: "Opus - Task Overview",
  ogTitle: "Task Overview" /* Title of page without branding */,
  ogSiteName: "opus" /* Overall site name */,
  ogType: "website" /* 'website' | 'article' | 'book' | 'profile' */,
  description: "Get an overview of all tasks in all your projects",
  ogDescription: "Get an overview of all tasks in all your projects",
  creator:
    "https://github.com/y-neck/ | https://github.com/kevinschaerer/" /* Creator of page */,
  robots: "noindex, nofollow" /* Robots meta tag */,
  ogImage: "" /* Image of page when sharing */,
});

/* Define sections locally */
function unsectionedSection(unsectionedTasks: any[]): {
  name: string;
  tasks: any[];
} {
  return {
    name: "Tasks without section",
    tasks: unsectionedTasks,
  };
}

/* Random hue for titles */
const generateRandomHue = (index: number) => {
  return Math.floor(Math.random() * 360);
};
</script>

<style scoped></style>
