<template>
  <div class="flex flex-col w-full">
    <Header pageTitle="Tasks" pageIcon="NoteIcon" />
    <main class="p-16">
      <div
        v-for="(project, projectIndex) in projectTasks"
        :key="project.projectId"
      >
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
              {{ section.name }}
            </h2>
            <p
              class="project-task-count text-grey-700 text-xs font-semibold p-1 w-4 bg-grey-100 rounded"
            >
              {{ section.tasks.length }}
            </p>
          </div>
          <div v-for="section in project.taskSections" :key="section.index">
            <div
              v-for="(task, taskIndex) in section.tasks"
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
                  <p class="task-property-dueDate">
                    {{
                      `${task.dueDate.day}.${task.dueDate.month}.${task.dueDate.year}` ||
                      'NaN'
                    }}
                  </p>
                  <span class="divider">·</span>
                  <p class="task-property-assignee">
                    {{
                      task.assignedTo.map((member) => member.name).join(', ') ||
                      'Everyone'
                    }}
                  </p>
                </div>
              </div>
              <div class="task-edit-actions flex justify-self-end gap-1">
                <button
                  class="edit-task-btn"
                  :data-task-id="task.id"
                  @click="toggleDropdown(`edit-task-dd-${task.id}`)"
                >
                  <PencilIcon />
                </button>
                <DropdownMenu
                  :id="`edit-task-dd-${task.id}`"
                  class="hidden"
                  v-if="isDropdownVisible[`edit-task-dd-${task.id}`]"
                >
                  <p role="menuitem" class="dropdown-menu-item">Edit Task</p>
                  <p role="menuitem" class="dropdown-menu-item">Mark as done</p>
                  <p role="menuitem" class="dropdown-menu-item">Delete Task</p>
                </DropdownMenu>
                <button class="context-menu-btn">
                  <DotsIcon />
                </button>
              </div>
            </div>
          </div>
          <button
            class="add-task-btn text-grey-500"
            @click="openNewTaskWindow()"
          >
            + Add Task
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Header from '~/components/Header.vue';
import DropdownMenu from '~/components/DropdownMenu.vue';
import projectTasks from '~/server/models/tasksETL';

/* Random hue for titles */
const generateRandomHue = (index: number) => {
  return Math.floor(Math.random() * 360);
};

/* Handle dropdowns */
import {
  isDropdownVisible,
  toggleDropdown,
} from '~/src/functions/handleDropdown';

/* Handle new-task-window */
// Open new-task-window
function openNewTaskWindow() {
  const addNewTaskWindow =
    document.querySelector<HTMLDivElement>('#add-task-backdrop');
  if (addNewTaskWindow) {
    addNewTaskWindow.classList.toggle('hidden');
  }
}
// Close new-task-window on escape-key
onMounted(() => {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelector('#add-task-backdrop')?.classList.add('hidden');
    }
  });
});
</script>

<style scoped>
/* Styles for dropdowns and layout */
.new-task-label {
  @apply text-grey-500;
}

.dropdown-menu-item:hover {
  @apply cursor-pointer;
  @apply bg-grey-100;
}
</style>
