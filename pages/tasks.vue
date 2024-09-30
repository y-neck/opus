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
              <!-- :style: random hsl color for each h2 title -->
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
                  @click="toggleEditTaskDropdown(task.id)"
                >
                  <PencilIcon />
                </button>
                <DropdownMenu
                  :id="`edit-task-dd-${task.id}`"
                  class="hidden"
                  v-if="isDropdownVisible[task.id]"
                >
                  <p
                    id="edit-task-dd-btn-edit"
                    role="menuitem"
                    class="dropdown-menu-item"
                  >
                    Edit Task
                  </p>
                  <p
                    id="task-done-dd-btn-done"
                    role="menuitem"
                    class="dropdown-menu-item"
                  >
                    Mark as done
                  </p>
                  <p
                    id="delete-task-dd-btn-delete"
                    role="menuitem"
                    class="dropdown-menu-item"
                  >
                    Delete Task
                  </p>
                </DropdownMenu>
                <button class="context-menu-btn"><DotsIcon /></button>
                <!-- TODO: Add functionality to btns -->
              </div>
            </div>
          </div>
          <button
            class="add-task-btn text-grey-500"
            @click="openNewTaskWindow()"
          >
            + Add Task
          </button>
          <div
            id="add-task-backdrop"
            class="fixed inset-0 bg-black bg-opacity-25 hidden transition-all duration-300"
          >
            <div
              id="add-task-window"
              class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-fit h-fit bg-white flex flex-col gap-5 p-8 rounded-lg border-grey-100 border-2"
            >
              <h2 class="font-medium text-2xl">Add a new task</h2>
              <form id="new-task-form" class="flex flex-col gap-2">
                <label for="new-task-name" class="new-task-label">Task</label>
                <input
                  id="new-task-name"
                  class="w-full h-12 border border-grey-100 rounded-md px-3 placeholder:text-grey-400"
                  type="text"
                  placeholder="Task name"
                  required
                />
                <div id="new-task-properties" class="flex gap-2">
                  <label for="new-task-section" class="sr-only"
                    >Select section</label
                  >
                  <select
                    id="new-task-section"
                    class="w-full h-12 border border-grey-100 rounded-md px-3 bg-white"
                    required
                  >
                    <option value="" selected disabled hidden>
                      Select a section
                    </option>
                    <option
                      v-for="section in project.taskSections"
                      :key="section.index"
                      :value="section.name"
                    >
                      {{ section.name }}
                    </option>
                  </select>
                  <label for="new-task-due-date" class="sr-only"
                    >Due Date</label
                  >
                  <input
                    id="new-task-due-date"
                    class="h-12 border border-grey-100 rounded-md px-3 placeholder:text-grey-400 w-fit"
                    type="date"
                    placeholder="Due Date"
                    required
                  />
                </div>
                <label for="new-task-assignees" class="new-task-label"
                  >Assign to</label
                >
                <div class="new-task-assignees flex gap-2 flex-wrap">
                  <div
                    v-for="member in project.projectMembers"
                    :key="member.id"
                    class="new-task-assignee flex items-center justify-center gap-2 border border-grey-100 rounded-md px-3 py-2 text-grey-700 hover:bg-grey-100 transition"
                  >
                    <label
                      :for="'member-' + member.id"
                      class="flex items-center justify-center gap-2"
                    >
                      {{ member.name }}
                    </label>
                    <input
                      type="checkbox"
                      :id="'member-' + member.id"
                      :value="member.name"
                      class="rounded-full"
                    />
                  </div>
                </div>
                <div id="new-task-error" class="hidden">
                  <p id="new-task-error-msg" class="text-destructive-red">
                    Please fill in at least name and due date
                  </p>
                </div>
              </form>
              <div id="add-task-window-btns" class="flex gap-2 self-end">
                <button
                  id="close-new-task-window"
                  class="w-fit h-12 hover:rounded-md px-3 hover:bg-grey-100 transition"
                  type="button"
                  @click="closeNewTaskWindow()"
                >
                  Cancel
                </button>
                <button
                  id="add-new-task"
                  class="w-fit h-12 rounded-md px-3 text-grey-700 bg-grey-100 hover:bg-grey-800 hover:text-grey-50 transition"
                  type="button"
                  @click="addNewTask()"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
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
import { ref } from 'vue';
import DropdownMenu from '~/components/DropdownMenu.vue';

import projectTasks from '~/server/models/tasksETL';

// Page meta
definePageMeta({
  title: 'Tasks',
  description: '',
  layout: 'default',
});

// Random hue for h2 titles
const generateRandomHue = (index: number) => {
  return Math.floor(Math.random() * 360);
};

/* Dropdown handling*/
// Initialize the visibility state for dropdowns by referencing tasks by id
const isDropdownVisible = ref<{ [taskId: number]: boolean }>({});

function toggleEditTaskDropdown(taskId: number) {
  // If another dropdown is open, close it
  Object.keys(isDropdownVisible.value).forEach((key) => {
    if (parseInt(key) !== taskId) {
      isDropdownVisible.value[parseInt(key)] = false;
    }
  });
  // Toggle the dropdown visibility for the specific task clicked on
  isDropdownVisible.value = {
    ...isDropdownVisible.value,
    [taskId]: !isDropdownVisible.value[taskId], // Toggle the visibility state
  };
}

// Show add-new-task-window
function openNewTaskWindow() {
  const addNewTaskWindow =
    document.querySelector<HTMLDivElement>('#add-task-backdrop');
  if (addNewTaskWindow) {
    addNewTaskWindow.classList.toggle('hidden');
  }
}

// Error handling for required fields
function checkRequiredFields() {
  const newTaskName =
    document.querySelector<HTMLInputElement>('#new-task-name');
  const newTaskDueDate =
    document.querySelector<HTMLInputElement>('#new-task-due-date');
  const alertMsg = document.querySelector<HTMLDivElement>('#new-task-error');
  if (!newTaskName?.value || !newTaskDueDate?.value) {
    alertMsg?.classList.remove('hidden');
    return false;
  } else {
    alertMsg?.classList.add('hidden');
    return true;
  }
}

// Add new task
function addNewTask() {
  const newTaskName =
    document.querySelector<HTMLInputElement>('#new-task-name');
  const newTaskSection =
    document.querySelector<HTMLInputElement>('#new-task-section');
  const newTaskDueDate =
    document.querySelector<HTMLInputElement>('#new-task-due-date');
  const newTaskAssignees = document.querySelector<HTMLInputElement>(
    '#new-task-assignees'
  );
  if (checkRequiredFields()) {
    // TODO: db logic
    console.log('Task added');
    closeNewTaskWindow();
  }
}

// Close add-new-task-window
function closeNewTaskWindow() {
  const addNewTaskWindow =
    document.querySelector<HTMLDivElement>('#add-task-backdrop');
  if (addNewTaskWindow) {
    addNewTaskWindow.classList.toggle('hidden');
  }
}

onMounted(() => {
  // Close add-new-task-window on escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelector('#add-task-backdrop')?.classList.add('hidden');
    }
  });
});
</script>

<style scoped>
:root {
  --randomHue: ${Math.floor(Math.random() * 360)};
}

.task-section-title {
  color: hsl(var(--randomHue), 20%, 50%);
}

.new-task-label {
  @apply text-grey-500;
}

/* Hover styling for dropdown-menu-item */
.dropdown-menu-item:hover {
  @apply cursor-pointer; /* Change cursor to pointer */
  @apply bg-grey-100;
}
</style>
