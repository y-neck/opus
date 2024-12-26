<template>
  <div class="flex flex-col w-full">
    <Header pageTitle="Tasks" pageIcon="NoteIcon" />
    <main class="p-16 flex flex-col">
      <div v-if="project">
        <div class="task-section-container">
          <!-- Task Sections with Tasks -->
          <div v-for="(section, index) in project.taskSections" :key="section.index">
            <!-- Section Header -->
            <div class="section-header flex items-center gap-4 border-b-2 border-b-grey-100">
              <h2 class="task-section-title text-2xl" :style="{ color: `hsl(${generateRandomHue(index)}, 25%, 60%)` }">
                {{ section.name }}
              </h2>
              <p class="project-task-count text-grey-700 text-xs font-semibold p-1 w-4 bg-grey-100 rounded">
                {{ section.tasks.length }}
              </p>
              <button
                class="edit-section-btn w-5 h-5 flex justify-center items-center rounded cursor-pointer hover:bg-grey-100 active:text-grey-950 text-grey-500 transition"
                :data-task-id="section.index"
                @click="openEditSectionWindow(section.index, section.name)"
                aria-label="edit task section"
              >
                <DotsIcon />
              </button>
              <EditSection :project="project" :section="section.name" :sectionId="section.index" />
            </div>

            <!-- Tasks under this section -->
            <div v-for="(task, taskIndex) in section.tasks" :key="task.id" class="task-container group flex items-center gap-2 p-4 h-16 w-full border-b-2 border-b-grey-100">
              <div class="task-info flex flex-row gap-2 align-baseline items-center">
                <input
                  class="task-checkbox w-4 h-4 border-grey-700"
                  type="checkbox"
                  role="checkbox"
                  aria-label="Checkbox to mark task as done"
                  :name="`check-task-${task.id}`"
                  :id="`task-checkbox-${task.id}`"
                  @click="markAsDone(task.id)"
                />
                <div class="task-properties">
                  <p
                    :class="{ 'task-property-title': true, 'task-done': task.status_id === 3 }"
                    :id="`task-title-${task.id}`"
                  >
                    {{ task.name }}
                  </p>
                  <div class="task-property-description flex text-grey-500 gap-1">
                    <p class="task-property-dueDate">
                      {{ task.dueDate ? `${task.dueDate.day}.${task.dueDate.month}.${task.dueDate.year}` : 'NaN' }}
                    </p>
                    <span class="divider">·</span>
                    <p class="task-property-assignee">{{ task.assignedTo }}</p>
                  </div>
                </div>
              </div>
              <div class="task-edit-actions flex flex-row opacity-0 gap-1 mt-1 group-hover:opacity-100 transition">
                <button
                  class="edit-task-btn w-5 h-5 flex justify-center items-center rounded cursor-pointer hover:bg-grey-100 active:text-grey-950 text-grey-500 transition"
                  :data-task-id="task.id"
                  @click="toggleDropdown(`edit-task-dd-${task.id}`)"
                  aria-label="edit task button"
                >
                  <PencilIcon />
                </button>
                <DropdownMenu :id="`edit-task-dd-${task.id}`" class="dropdown hidden" v-if="isDropdownVisible[`edit-task-dd-${task.id}`]">
                  <p role="menuitem" class="dropdown-menu-item" :data-task-id="task.id" @click="openEditTaskWindow(task.id)">
                    <PencilIcon /> Edit Task
                  </p>
                  <EditTask :project="project" :task="task" :taskId="task.id"/>
                  <p role="menuitem" class="dropdown-menu-item" @click="markAsDone(task.id)">
                    <CheckmarkIcon /> Toggle done
                  </p>
                  <p :id="`delete-task-${task.id}`" role="menuitem" class="dropdown-menu-item text-destructive-red" @click="deleteTask(task.id)">
                    <TrashCanIcon /> Delete Task
                  </p>
                </DropdownMenu>
              </div>
            </div>
          </div>

          <!-- Unsectioned Tasks -->
          <div v-if="project.unsectionedTasks && project.unsectionedTasks.length > 0" class="unsectioned-tasks-container">
            <h2 class="task-section-title text-2xl">Unsectioned Tasks</h2>
            <div v-for="(task, taskIndex) in project.unsectionedTasks" :key="task.id" class="task-container group flex items-center gap-2 p-4 h-16 w-full border-b-2 border-b-grey-100">
              <div class="task-info flex flex-row gap-2 align-baseline items-center">
                <input class="task-checkbox w-4 h-4 border-grey-700" type="checkbox" :name="`check-task-${task.id}`" :id="`task-${task.id}`" />
                <div class="task-properties">
                  <p class="task-property-title" :id="`task-${task.name}`">{{ task.name }}</p>
                  <div class="task-property-description flex text-grey-500 gap-1">
                    <p class="task-property-dueDate">
                      {{ task.dueDate ? `${task.dueDate.day}.${task.dueDate.month}.${task.dueDate.year}` : 'NaN' }}
                    </p>
                    <span class="divider">·</span>
                    <p class="task-property-assignee">{{ task.assignedTo }}</p>
                  </div>
                </div>
              </div>
              <div class="task-edit-actions flex flex-row opacity-0 gap-1 mt-1 group-hover:opacity-100 transition">
                <button
                  class="edit-task-btn w-5 h-5 flex justify-center items-center rounded cursor-pointer hover:bg-grey-100 active:text-grey-950 text-grey-500 transition"
                  :data-task-id="task.id"
                  @click="toggleDropdown(`edit-task-dd-${task.id}`)"
                >
                  <PencilIcon />
                </button>
                <DropdownMenu :id="`edit-task-dd-${task.id}`" class="hidden" v-if="isDropdownVisible[`edit-task-dd-${task.id}`]">
                  <p role="menuitem" class="dropdown-menu-item" :data-task-id="task.id" @click="openEditTaskWindow(task.id)">
                    <PencilIcon /> Edit Task
                  </p>
                  <EditTask :project="project" :task="task" :taskId="task.id"/>
                  <p role="menuitem" class="dropdown-menu-item" @click="markAsDone(task.id)">
                    <CheckmarkIcon /> Toggle done
                  </p>
                  <p :id="`delete-task-${task.id}`" role="menuitem" class="dropdown-menu-item text-destructive-red" @click="deleteTask(task.id)">
                    <TrashCanIcon /> Delete Task
                  </p>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else><p>Please select a project.</p></div>
      <div v-if="project" id="context-menu" class="flex gap-8 justify-center">
      <div id="add-task-container" class="self-center flex flex-col gap-2">
      <AddTask :project="project"/>
      <button class="add-task-btn text-grey-500" @click="openNewTaskWindow()">+ Add Task</button>
</div>
    <div id="add-section-container" class="self-center flex flex-col gap-2">
      <AddSection :project="project"/>
      <button class="add-task-btn text-grey-500" @click="openNewSectionWindow()">+ Add Section</button>
</div></div>
    </main>
  </div>
</template>


<script setup lang="ts">
import { supabaseConnection } from '~/composables/supabaseConnection';
import Header from '~/components/Header.vue';
import DropdownMenu from '~/components/DropdownMenu.vue';
/* Import modals */
import EditSection from '~/components/Modals/EditSection.vue';
import AddTask from '~/components/Modals/AddTask.vue';
import EditTask from '~/components/Modals/EditTask.vue';
import AddSection from '~/components/Modals/AddSection.vue';

import userProfile from '~/middleware/auth';
import { ref, onMounted } from 'vue';
/* Import projects */
import projectTasksModel, {
  type Project,
} from '~/middleware/models/projectsETL';
import { getProjects } from '~/middleware/projectMiddleware';
import { useProjectStore } from '~/middleware/projectStore';

// Page meta
definePageMeta({
  title: 'Tasks',
  description: '',
  middleware: 'auth',
  layout: 'default',
});
useSeoMeta({
  title: 'Opus - Tasks',
  ogTitle: 'Tasks' /* Title of page without branding */,
  ogSiteName: 'opus' /* Overall site name */,
  ogType: 'website' /* 'website' | 'article' | 'book' | 'profile' */,
  description:
    'Display and manage the tasks for your projects',
  ogDescription:
    'Display and manage the tasks for your projects',
  creator: 'https://github.com/y-neck/ | https://github.com/kevinschaerer/' /* Creator of page */,
  robots: 'noindex, nofollow' /* Robots meta tag */,
  ogImage:
    '' /* Image of page when sharing */,
});

/* Handle active project */
const project = computed(() => {
  // Find project based on active project ID
return projectTasks.value.find(p=>p.projectId===projectStore.activeProjectId);
})
// Make projectTasks a ref to enable reactivity
const projectTasks = ref<Project[]>([]);
// Initialize pinia project store
const projectStore = useProjectStore();

/* DB CRUD */

onMounted(async () => {
  // Fetch projects data from DB
  projectTasks.value = await getProjects();
  projectTasks.value = [...projectTasks.value]; // Enforcing reactivity
  // DEBUG:
  console.log('Project tasks from projectETL:', projectTasks.value);
});

/* Random hue for titles */
const generateRandomHue = (index: number) => {
  return Math.floor(Math.random() * 360);
};


/* Mark task as done */
async function markAsDone(taskId: number) {
  console.log('Marking task as done: task-id', taskId);
  const { data: getTaskStatus, error: getTaskStatusError } =
    await supabaseConnection()
      .supabase.from('Tasks')
      .select('status_id')
      .eq('id', taskId)
      .single(); // Extract as value, not as array
  
      if(getTaskStatusError){
        console.log('Error fetching task status:', getTaskStatusError);
        return;
      }

      const currentStatus = Number(getTaskStatus?.status_id);
      const newStatus = currentStatus === 1 || currentStatus === 2 ? 3 : 2; // If status is todo/in-progress, change to done, else change to in-progress as changing the status means the task is in progress
        const { error: updateTaskError } = await supabaseConnection()
          .supabase.from('Tasks')
          .update({ status_id: newStatus })
          .eq('id', taskId);
      
if (updateTaskError) {
      console.error('Error updating task status:', updateTaskError);
      return;
}

// Mark task as done visually with reactivity
if (project.value) {
  const section = project.value.taskSections?.find((section:any) =>
    section.tasks.some((task:any) => task.id === taskId)
  );
  if (section) {
    const taskIndex = section.tasks.findIndex((task:any) => task.id === taskId);
    if (taskIndex !== -1) {
      section.tasks[taskIndex] = {
        ...section.tasks[taskIndex], // Spread operator to create a new object
        status_id: newStatus, // Update the status
      };
    }
  }
}
// DEBUG:
console.log(
  `Updated task status to ${newStatus === 3 ? 'done' : 'not done'}: task-id`,
  taskId
);
}

/* Handle dropdowns */
import {
  isDropdownVisible,
  toggleDropdown,
} from '~/src/functions/handleDropdown';
import CheckmarkIcon from '~/components/icons/CheckmarkIcon.vue';

// Refresh tasks
async function refreshTasks(taskId?: number) {
    if (project.value) {
      // Find the section containing the task
      const section = project.value.taskSections?.find((section: any) =>
        section.tasks.some((task: any) => task.id === taskId)
      );

      if (section) {
        // Remove the task from the section
        section.tasks = section.tasks.filter((task: any) => task.id !== taskId);
      } else if (project.value.unsectionedTasks) {
        // If the task is unsectioned, remove it from the unsectionedTasks array
        project.value.unsectionedTasks = project.value.unsectionedTasks.filter(
          (task: any) => task.id !== taskId
        );
      }
    }
}

// Delete task
async function deleteTask(taskId: number) {
  try{
  const response = await supabaseConnection().supabase
  .from('Tasks')
  .delete()
  .eq('id', taskId);
  } catch (error) {
    console.error('Error deleting task:', error);
    return;
  }
  refreshTasks(taskId);
    // // DEBUG:
    // console.log(`Task deleted: task-id ${taskId}`);
}

/* Handle new-task-window */
// Open new-task-window
function openNewTaskWindow() {
  const addNewTaskWindow =
    document.querySelector<HTMLDivElement>('#add-task-backdrop');
  if (addNewTaskWindow) {
    addNewTaskWindow.classList.toggle('hidden');
  }
}

function openNewSectionWindow() {
  const addNewSectionWindow =
    document.querySelector<HTMLDivElement>('#add-section-backdrop');
  if (addNewSectionWindow) {
    addNewSectionWindow.classList.toggle('hidden');
  }
}

function openEditSectionWindow(sectionId: number, section: string) {
  // // DEBUG:
  // console.log('Opening edit section window: ', sectionId, section);
  const editSectionWindow =
    document.querySelector<HTMLDivElement>(`#edit-section-backdrop-${sectionId}`);
  if (editSectionWindow) {
    editSectionWindow.classList.toggle('hidden');
  }
}

function openEditTaskWindow(taskId: number) {
  // // DEBUG:
  // console.log('Opening edit task window: ', taskId);
  const editTaskWindow =
    document.querySelector(`#edit-task-backdrop-${taskId}`);
  if (editTaskWindow) {
    editTaskWindow.classList.remove('hidden');
    // Hide dropdowns
    document.querySelectorAll('.dropdown-overlay').forEach((el) => {
      el.classList.add('hidden');
    });
  }
}
</script>

<style scoped>
/* Styles for dropdowns and layout */
.task-section-container {
  @apply pb-16 flex flex-col gap-4;
}

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

.task-done {
  @apply text-grey-500 line-through;
}
</style>
