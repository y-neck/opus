<template>
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
                      v-for="section in props.project?.taskSections"
                      :key="section.index"
                      :value="section.name"
                      class=""
                    >
                      {{ section.name }}
                    </option>
                  </select>
                  <label for="new-task-due-date" class="new-task-label sr-only"
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
                    v-for="member in props.project?.projectMembers"
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
                    Please fill in all fields.
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
</template>

<script setup lang="ts">
/* Handle dropdowns */
import {
  isDropdownVisible,
  toggleDropdown,
} from '~/src/functions/handleDropdown';
import CheckmarkIcon from '~/components/icons/CheckmarkIcon.vue';

// Props
const props = defineProps({
  project: Object,
})

/* Handle new-task-window */
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

// Close new-task-window
function closeNewTaskWindow() {
  const addNewTaskWindow =
    document.querySelector<HTMLDivElement>('#add-task-backdrop');
  if (addNewTaskWindow) {
    addNewTaskWindow.classList.add('hidden');
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
.new-task-label {
  @apply text-grey-500;
}

.dropdown-menu-item {
  @apply flex;
  @apply items-center;
  @apply gap-2;
}

.dropdown-menu-item:hover {
  @apply cursor-pointer;
  @apply bg-grey-100;
}
</style>