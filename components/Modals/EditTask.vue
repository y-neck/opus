<template>
  <div
            :id="`edit-task-backdrop-${props.taskId}`"
            class="fixed inset-0 bg-black bg-opacity-25 hidden transition-all duration-300"
          >
            <div
              id="edit-task-window"
              class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-fit h-fit bg-white flex flex-col gap-5 p-8 rounded-lg border-grey-100 border-2"
            >
              <h2 class="font-medium text-2xl">Edit task {{props.task?.name}}</h2>
              <form id="edit-task-form" class="flex flex-col gap-2">
                <label for="edit-task-name" class="edit-task-label">Task</label>
                <input
                  id="edit-task-name"
                  v-model="editTaskName"
                  class="w-full h-12 border border-grey-100 rounded-md px-3 placeholder:text-grey-400"
                  type="text"
                  :placeholder="`${props.task?.name}`"
                  required
                />
                <div id="edit-task-properties" class="flex gap-2">
                  <label for="edit-task-section" class="sr-only"
                    >Select section</label
                  >
                  <select
                    id="edit-task-section"
                    v-model="editTaskSection"
                    class="w-full h-12 border border-grey-100 rounded-md px-3 bg-white"
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
                  <label for="edit-task-due-date" class="edit-task-label sr-only"
                    >Due Date</label
                  >
                  <input
                    id="edit-task-due-date"
                    v-model="editTaskDueDate"
                    class="h-12 border border-grey-100 rounded-md px-3 placeholder:text-grey-400 w-fit"
                    type="date"
                    :placeholder="editTaskDueDate"
                    required
                  />
                </div>
                <!-- TODO: Assign-to functionality -->
                <!-- <label for="edit-task-assignees" class="edit-task-label"
                  >Assign to</label
                >
                <div class="edit-task-assignees flex gap-2 flex-wrap">
                  <div
                    v-for="member in props.project?.projectMembers"
                    :key="member.id"
                    class="edit-task-assignee flex items-center justify-center gap-2 border border-grey-100 rounded-md px-3 py-2 text-grey-700 hover:bg-grey-100 transition"
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
                      v-model="editTaskAssignees[member.id]"
                      class="rounded-full"
                    />
                  </div>
                </div> -->
                <div id="edit-task-error" class="hidden">
                  <p id="edit-task-error-msg" class="text-destructive-red">
                    Please fill in all fields.
                  </p>
                </div>
              </form>
              <div id="edit-task-window-btns" class="flex gap-2 self-end">
                <button
                  id="close-edit-task-window"
                  class="w-fit h-12 hover:rounded-md px-3 hover:bg-grey-100 transition"
                  type="button"
                  @click="closeEditTaskWindow()"
                >
                  Cancel
                </button>
                <button
                  id="add-edit-task"
                  class="w-fit h-12 rounded-md px-3 text-grey-700 bg-grey-100 hover:bg-grey-800 hover:text-grey-50 transition"
                  type="button"
                  @click="editTask()"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
</template>

<script setup>
import { getProjects } from '~/middleware/projectMiddleware';

/* Handle active project */
import { useProjectStore } from '~/middleware/projectStore';
import projectTasks from '~/middleware/models/projectsETL';
const projectStore = useProjectStore();

// Props
const props = defineProps({
  project: Object,
  task: Object,
  taskId: Number,
})

// Refs for inputs
const editTaskName = ref('');
const editTaskSection = ref('');
const editTaskDueDate = ref('');
const editTaskAssignees = ref({});
const showError = ref(false);

/* Handle edit-task-window */
// Error handling for required fields
function checkRequiredFields() {
  if (!editTaskName.value || !editTaskDueDate.value) {
    showError.value = true;
    return false;
  } else {
    showError.value = false;
    return true;
  }
}

// Edit task
async function editTask() {
  if (checkRequiredFields()) {
    // Update task in DB
    try {
      const { data, error: editTaskError } = await supabaseConnection().supabase
        .from('Tasks')
        .update([
          {
            name: editTaskName.value,
            due_date: new Date(editTaskDueDate.value).toISOString(),
            status_id: 2,
            projects_id: projectStore.activeProjectId,
            // TODO: assigned_to: selectedAssignees.length ? selectedAssignees : null,
            tasks_section: props.project.taskSections?.find((sec) => sec.name === editTaskSection.value)?.index, // Find section index based on section name
          },
        ])
        .eq('id', props.taskId)
        .select();
      if (editTaskError) {
        console.error('Error editing task:', editTaskError);
        return;
      }
      else {console.log('Task edited successfully');
      closeEditTaskWindow();}

      /* Refresh tasks */
      const updatedTask = data[0]; // Get the updated task
      // Find the section containing the task
      // Remove the task from its current section
      props.project?.taskSections?.forEach((section) => {
        const taskIndex = section.tasks.findIndex((task) => task.id === updatedTask.id);
        if (taskIndex !== -1) {
          section.tasks.splice(taskIndex, 1); // Remove the task from the old section
        }
      });

      // Add the task to the updated section
      const newSection = props.project?.taskSections?.find((sec) => sec.index === updatedTask.tasks_section);
      if (newSection) {
        if (!newSection.tasks) newSection.tasks = []; // Initialize tasks array if undefined
        newSection.tasks.push(updatedTask); // Add the updated task to the new section
      } else if (props.project?.unsectionedTasks) {
        const taskIndex = props.project.unsectionedTasks.findIndex((task) => task.id === updatedTask.id);
        if (taskIndex !== -1) {
          props.project.unsectionedTasks[taskIndex] = updatedTask; // Update in unsectioned tasks
        } else {
          props.project.unsectionedTasks.push(updatedTask); // Add new unsectioned task if necessary
        }
      }

    } catch (editTaskError) {
      console.error('Error editing task:', editTaskError);
    }
        
    // DEBUG:
console.log('Task edited:', {
      name: editTaskName.value,
      section: editTaskSection?.value,
      dueDate: editTaskDueDate.value,
      // assignees: selectedAssignees,
    });
    closeEditTaskWindow();
  }
}

// Close edit-task-window
function closeEditTaskWindow() {
  const editTaskWindow = document.querySelector(`#edit-task-backdrop-${props.taskId}`);
  if (editTaskWindow) {
    editTaskWindow.classList.add('hidden');
  }
}

// Close edit-task-window on escape-key
onMounted(async () => {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelector(`#edit-task-backdrop-${props.taskId}`)?.classList.toggle('hidden', true);
    }
  });
  // Fetch projects data from DB
  try {
    projectTasks.value = await getProjects();
    projectTasks.value = [...projectTasks.value];
  } catch (fetchProjectError) {
    console.error('Error fetching projects:', fetchProjectError);
  }

  /* Initialize reactive input values */
  if(props.task){
    editTaskName.value = props.task.name; // Set task name
    // Find section name based on task's section index
    const section = props.project?.taskSections?.find((sec) => sec.index === props.task.tasksSection || sec.name === props.task.tasksSection);
    editTaskSection.value = section ? section.name : ''; // Set the current section name or empty
    }
    // Set due date
    if(props.task.dueDate){
      const {year, month, day} = props.task.dueDate;
      editTaskDueDate.value = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`; // Format date as yyyy-mm-dd
    }
});
</script>

<style scoped>
.edit-task-label {
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