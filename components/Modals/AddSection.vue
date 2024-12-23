<template>
<div
            id="add-section-backdrop"
            class="fixed inset-0 bg-black bg-opacity-25 hidden transition-all duration-300"
          >
            <div
              id="add-section-window"
              class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-fit h-fit bg-white flex flex-col gap-5 p-8 rounded-lg border-grey-100 border-2"
            >
              <h2 class="font-medium text-2xl">Add a new section</h2>
              <form id="new-section-form" class="flex flex-col gap-2">
                <label for="new-section-name" class="new-section-label">Section</label>
                <input
                  id="new-section-name"
                  v-model="newSectionName"
                  class="w-full h-12 border border-grey-100 rounded-md px-3 placeholder:text-grey-400"
                  type="text"
                  placeholder="Section name"
                  required
                />
              </form>
              <div id="add-section-window-btns" class="flex gap-2 self-end">
                <button
                  id="close-new-section-window"
                  class="w-fit h-12 hover:rounded-md px-3 hover:bg-grey-100 transition"
                  type="button"
                  @click="closeNewSectionWindow()"
                >
                  Cancel
                </button>
                <button
                  id="add-new-section"
                  class="w-fit h-12 rounded-md px-3 text-grey-700 bg-grey-100 hover:bg-grey-800 hover:text-grey-50 transition"
                  type="button"
                  @click="addNewSection()"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
</template>

<script setup>
/* Handle dropdowns */
import { getProjects } from '~/middleware/projectMiddleware';

/* Handle active project */
import { useProjectStore } from '~/middleware/projectStore';
import projectTasks from '~/middleware/models/projectsETL';
const projectStore = useProjectStore();

// Props
const props = defineProps({
  project: Object,
})

// Refs for inputs
const newSectionName = ref('');
const showError = ref(false);

/* Handle new-section-window */
// Error handling for required fields
function checkRequiredFields() {
  if (!newSectionName.value) {
    showError.value = true;
    return false;
  } else {
    showError.value = false;
    return true;
  }
}

// Add new section
async function addNewSection() {
  if (checkRequiredFields()) {
    // Add new Section to DB
    try {
      const { error: addSectionError, data } = await supabaseConnection().supabase
        .from('Tasks_Sections')
        .insert([
          {
            section_name: newSectionName.value,
            project_id: projectStore.activeProjectId,
          },
        ])
        .select();

      if (addSectionError) {
        console.error('Error adding Section:', addSectionError);
        return;
      }
      else {console.log('Section added successfully');
      closeNewSectionWindow();}

      // Refresh tasks
      if (props.project.taskSections) {
        props.project.taskSections.push({
          name: newSectionName.value,
          index: data[0].id, // Assuming the database returns the ID of the newly added section
          tasks: [],
        });
      } else {
        props.project.taskSections = [
          {
            name: newSectionName.value,
            index: data[0].id,
            tasks: [],
          },
        ];
      }}
    catch (error) {
      console.error('Unexpected error adding section:', error);
    }}}

// Close new-section-window
function closeNewSectionWindow() {
  const addNewSectionWindow = document.querySelector('#add-section-backdrop');
  if (addNewSectionWindow) {
    addNewSectionWindow.classList.toggle('hidden', true);
  }
}

// Close new-task-window on escape-key
onMounted(() => {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelector('#add-section-backdrop')?.classList.add('hidden');
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