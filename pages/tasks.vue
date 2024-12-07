<template>
  <div class="flex flex-col w-full">
    <Header pageTitle="Tasks" pageIcon="NoteIcon" />
    <main class="p-16 flex flex-col">
      <div
        v-for="(project, projectIndex) in projectTasks"
        :key="project.projectId"
      >
        <div class="task-section-container">
          <!-- Task Section Header and Task Count -->
          <div
            v-for="(section, index) in project.taskSections"
            :key="section.index"
            class="section-header flex items-center gap-4 border-b-2 border-b-grey-100"
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

          <!-- Tasks within each section -->
          <div v-for="section in project.taskSections" :key="section.index">
            <div
              v-for="(task, taskIndex) in section.tasks"
              :key="task.id"
              class="task-container group flex items-center gap-2 p-4 h-16 w-full border-b-2 border-b-grey-100"
            >
              <div
                class="task-info flex flex-row gap-2 align-baseline items-center"
              >
                <input
                  class="task-checkbox w-4 h-4 border-grey-700"
                  type="checkbox"
                  :name="`check-task-${task.id}`"
                  :id="`task-${task.id}`"
                  @click="markAsDone(task.id)"
                />
                <div class="task-properties">
                  <p class="task-property-title" :id="`task-${task.name}`">
                    {{ task.name }}
                  </p>
                  <div
                    class="task-property-description flex text-grey-500 gap-1"
                  >
                    <p class="task-property-dueDate">
                      {{
                        task.dueDate
                          ? `${task.dueDate.day}.${task.dueDate.month}.${task.dueDate.year}`
                          : 'NaN'
                      }}
                    </p>
                    <span class="divider">·</span>
                    <p class="task-property-assignee">
                      {{ task.assignedTo }}
                    </p>
                  </div>
                </div>
              </div>
              <div
                class="task-edit-actions flex flex-row opacity-0 gap-1 mt-1 group-hover:opacity-100 transition"
              >
                <button
                  class="edit-task-btn w-5 h-5 flex justify-center items-center rounded cursor-pointer hover:bg-grey-100 active:text-grey-950 text-grey-500 transition"
                  :data-task-id="task.id"
                  @click="toggleDropdown(`edit-task-dd-${task.id}`)"
                >
                  <PencilIcon />
                </button>
                <!-- TODO: menu functionality -->
                <DropdownMenu
                  :id="`edit-task-dd-${task.id}`"
                  class="hidden"
                  v-if="isDropdownVisible[`edit-task-dd-${task.id}`]"
                >
                  <p role="menuitem" class="dropdown-menu-item">
                    <PencilIcon />Edit Task
                  </p>
                  <p
                    role="menuitem"
                    class="dropdown-menu-item"
                    @click="markAsDone(task.id)"
                  >
                    <CheckmarkIcon />Toggle done
                  </p>
                  <p
                    role="menuitem"
                    class="dropdown-menu-item text-destructive-red"
                  >
                    <TrashCanIcon />Delete Task
                  </p>
                </DropdownMenu>
                <button
                  class="context-menu-btn w-5 h-5 flex justify-center items-center rounded cursor-pointer hover:bg-grey-100 active:text-grey-950 text-grey-500 transition"
                  :data-task-id="task.id"
                  @click="toggleDropdown(`context-menu-dd-${task.id}`)"
                >
                  <DotsIcon />
                </button>
                <DropdownMenu
                  :id="`context-menu-dd-${task.id}`"
                  class="hidden"
                  v-if="isDropdownVisible[`context-menu-dd-${task.id}`]"
                >
                  <p role="menuitem" class="dropdown-menu-item">
                    <ChevronDoubleRightIcon />Move to ...
                  </p>
                  <p
                    role="menuitem"
                    class="dropdown-menu-item text-destructive-red"
                  >
                    <TrashCanIcon />Delete Task
                  </p>
                </DropdownMenu>
              </div>
            </div>
          </div>
          
          <!-- Unsectioned tasks -->
          <div v-if="project.unsectionedTasks && project.unsectionedTasks.length > 0" class="unsectioned-tasks-container">
            <h2 class="task-section-title text-2xl">Unsectioned Tasks</h2>
            <div
              v-for="(task, taskIndex) in project.unsectionedTasks"
              :key="task.id"
              class="task-container group flex items-center gap-2 p-4 h-16 w-full border-b-2 border-b-grey-100"
            >
              <div class="task-info flex flex-row gap-2 align-baseline items-center">
                <input
                  class="task-checkbox w-4 h-4 border-grey-700"
                  type="checkbox"
                  :name="`check-task-${task.id}`"
                  :id="`task-${task.id}`"
                />
                <div class="task-properties">
                  <p class="task-property-title" :id="`task-${task.name}`">
                    {{ task.name }}
                  </p>
                  <div class="task-property-description flex text-grey-500 gap-1">
                    <p class="task-property-dueDate">
                      {{
                        task.dueDate
                          ? `${task.dueDate.day}.${task.dueDate.month}.${task.dueDate.year}`
                          : 'NaN'
                      }}
                    </p>
                    <span class="divider">·</span>
                    <p class="task-property-assignee">
                      {{ task.assignedTo }}
                    </p>
                  </div>
                </div>
              </div>
              <div
                class="task-edit-actions flex flex-row opacity-0 gap-1 mt-1 group-hover:opacity-100 transition"
              >
                <button
                  class="edit-task-btn w-5 h-5 flex justify-center items-center rounded cursor-pointer hover:bg-grey-100 active:text-grey-950 text-grey-500 transition"
                  :data-task-id="task.id"
                  @click="toggleDropdown(`edit-task-dd-${task.id}`)"
                >
                  <PencilIcon />
                </button>
                <!-- TODO: menu functionality -->
                <DropdownMenu
                  :id="`edit-task-dd-${task.id}`"
                  class="hidden"
                  v-if="isDropdownVisible[`edit-task-dd-${task.id}`]"
                >
                  <p role="menuitem" class="dropdown-menu-item">
                    <PencilIcon />Edit Task
                  </p>
                  <p
                    role="menuitem"
                    class="dropdown-menu-item"
                    @click="markAsDone(task.id)"
                  >
                    <CheckmarkIcon />Toggle done
                  </p>
                  <p
                    role="menuitem"
                    class="dropdown-menu-item text-destructive-red"
                  >
                    <TrashCanIcon />Delete Task
                  </p>
                </DropdownMenu>
                <button
                  class="context-menu-btn w-5 h-5 flex justify-center items-center rounded cursor-pointer hover:bg-grey-100 active:text-grey-950 text-grey-500 transition"
                  :data-task-id="task.id"
                  @click="toggleDropdown(`context-menu-dd-${task.id}`)"
                >
                  <DotsIcon />
                </button>
                <DropdownMenu
                  :id="`context-menu-dd-${task.id}`"
                  class="hidden"
                  v-if="isDropdownVisible[`context-menu-dd-${task.id}`]"
                >
                  <p role="menuitem" class="dropdown-menu-item">
                    <ChevronDoubleRightIcon />Move to ...
                  </p>
                  <p
                    role="menuitem"
                    class="dropdown-menu-item text-destructive-red"
                  >
                    <TrashCanIcon />Delete Task
                  </p>
                </DropdownMenu>
              </div>
            </div>
          </div>

          <!-- Add task component -->
          <AddTask :project="project"/>
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
import { supabaseConnection } from '~/composables/supabaseConnection';
import Header from '~/components/Header.vue';
import DropdownMenu from '~/components/DropdownMenu.vue';
import AddTask from '~/components/Modals/AddTask.vue';
import userProfile from '~/middleware/auth';
import { ref, onMounted } from 'vue';
/* Import projects */
import projectTasksModel, {
  type Project,
} from '~/middleware/models/projectsETL';
import { getProjects } from '~/middleware/projectMiddleware';
// Page meta
definePageMeta({
  title: 'Tasks',
  description: '',
  middleware: 'auth',
  layout: 'default',
});

/* DB CRUD */
// Make projectTasks a ref to enable reactivity
const projectTasks = ref<Project[]>([]);

onMounted(async () => {
  // Fetch projects data from DB
  projectTasks.value = await getProjects();
  console.log('Project tasks from projectETL:', projectTasks.value);

  // Get done tasks and mark them
  const markDoneTasks = () => {
    projectTasks.value.forEach((project) => {
      project.taskSections?.forEach((section) => {
      project.tasks?.forEach((task) => {
        if (task.status_id === 3) {
          document
            .querySelector<HTMLInputElement>(`#task-${task.id}`)
            ?.classList.add('task-done');
        }
      });
      });
    });
  };
  console.log('Marked tasks as done');
  return {
    projectTasks,
    markDoneTasks,
  };
});

/* Random hue for titles */
const generateRandomHue = (index: number) => {
  return Math.floor(Math.random() * 360);
};

/* Mark task as done */
async function markAsDone(taskId: number) {
  console.log('Marked task as done: task-id', taskId);
  // TODO: Change task status to done
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
        console.log('Updated task status to done: task-id', taskId);
      
if (updateTaskError) {
      console.error('Error updating task status:', updateTaskError);
      return;
}
    console.log(
      `Updated task status to ${newStatus === 3 ? 'done' : 'not done'}: task-id`,
      taskId
    );

  // Mark task as done visually
  document
    .querySelector<HTMLInputElement>(`#task-${taskId}`)
    ?.classList.toggle('task-done');
}

/* Handle dropdowns */
import {
  isDropdownVisible,
  toggleDropdown,
} from '~/src/functions/handleDropdown';
import CheckmarkIcon from '~/components/icons/CheckmarkIcon.vue';

/* Handle new-task-window */
// Open new-task-window
function openNewTaskWindow() {
  const addNewTaskWindow =
    document.querySelector<HTMLDivElement>('#add-task-backdrop');
  if (addNewTaskWindow) {
    addNewTaskWindow.classList.toggle('hidden');
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
