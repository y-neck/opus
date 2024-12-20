<template>
  <div
            :id="`edit-section-backdrop-${sectionId}`"
            class="fixed inset-0 bg-black bg-opacity-25 hidden transition-all duration-300"
          >
            <div
              id="edit-section-window"
              class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-fit h-fit bg-white flex flex-col gap-5 p-8 rounded-lg border-grey-100 border-2"
            >
              <h2 class="font-medium text-2xl">Edit Section</h2>
              <form id="edit-section-form" class="flex flex-col gap-2">
                <label for="edit-section-name" class="edit-section-label">Edit Section name:</label>
                <input
                  id="rename-section"
                  class="w-full h-12 border border-grey-100 rounded-md px-3 placeholder:text-grey-400"
                  type="text"
                  :placeholder="section || 'Edit section name'"
                  v-model="renameSectionName"
                /> <!-- FIXME: Get section name of current section id-->
                <div id="more-section-actions" class="flex gap-2">
                  <label for="add-section" class="edit-section-label">Add new section:</label>
                <input
                  id="add-section"
                  class="w-full h-12 border border-grey-100 rounded-md px-3 placeholder:text-grey-400"
                  type="text"
                  :placeholder="'New section name'"
                  v-model="newSectionName"
                />
                <button id="delete-section-btn" class="w-fit h-12 flex rounded-md px-3 text-destructive-red hover:bg-grey-100 transition"><TrashCanIcon /><span>Delete Section</span></button>
                </div>
                
              </form>
              <div id="edit-section-window-btns" class="flex gap-2 self-end">
                <button
                  id="close-new-task-window"
                  class="w-fit h-12 hover:rounded-md px-3 hover:bg-grey-100 transition"
                  type="button"
                  @click="closeEditSectionWindow()"
                >
                  Cancel
                </button>
                <button
                  id="edit-section-submit"
                  class="w-fit h-12 rounded-md px-3 text-grey-700 bg-grey-100 hover:bg-grey-800 hover:text-grey-50 transition"
                  type="button"
                  @click="saveSectionEdits()"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
</template>

<script setup>
/* Handle dropdowns */
import {
  isDropdownVisible,
  toggleDropdown,
} from '~/src/functions/handleDropdown';
import CheckmarkIcon from '~/components/icons/CheckmarkIcon.vue';
import TrashCanIcon from '../icons/TrashCanIcon.vue';

import { useProjectStore } from '~/middleware/projectStore';
const projectStore = useProjectStore();
const currentProjectId = computed(() => projectStore.activeProjectId);

// Props
const props = defineProps({
  project: Object,
  section: String,
  sectionId: Number,
})

// Refs
const renameSectionName = ref('');
const newSectionName = ref('');
const currentSectionId = ref(null);

// Close new-task-window on escape-key
onMounted(() => {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelector('#edit-section-backdrop')?.classList.add('hidden');
    }
  });
});

// ensure that props.section actually changes when you selecting a new section
watch(
  () => props.sectionId,
  (newSectionId) => {
    if (newSectionId !== null && props.section) {
      renameSectionName.value = props.section;
      currentSectionId.value = newSectionId;
    } else{
      renameSectionName.value = ''; // Reset renameSectionName if section is not provided
      currentSectionId.value = null;
    }
  },
  { immediate: true } // Trigger on initial mount
);

/* Handle edit-section-window */
// Close new-task-window
function closeEditSectionWindow() {
  const editSectionWindow =
    document.querySelector(`#edit-section-backdrop-${props.sectionId}`);
  if (editSectionWindow) {
    editSectionWindow.classList.add('hidden');
  }
}

async function renameSection(renameSectionName, currentSectionId) {
  // DEBUG:
  console.log('Renaming section: ', renameSectionName, currentSectionId);

  const { error: renameSectionError } = await supabaseConnection().supabase
      .from('Tasks_Sections')
      .update({ section_name: renameSectionName })
      .eq('id', currentSectionId);
      if (renameSectionError){
        console.error('Error renaming section:', renameSectionError);
      }
    }

async function addNewSection (newSectionName){
  const {error: addNewSectionError} = await supabaseConnection().supabase
      .from('Tasks_Sections')
      .insert({ index: currentProjectId, name: newSectionName });
    if (addNewSectionError){
      console.error('Error adding new section:', addNewSectionError);
    }
}

// Save new section name
async function saveSectionEdits() {
  // // DEBUG:
  // console.log('Current section to be edited: ',currentSectionId)
  
  if(renameSectionName.value.length > 0 && currentSectionId.value !== undefined) {
    try{
      await renameSection(renameSectionName.value, currentSectionId.value);
      // DEBUG:
      console.log('Section renamed successfully');
      closeEditSectionWindow();
    } catch (error) {
      console.error('Error renaming section:', error);
    }
  }
  if (newSectionName.value.length > 0) {
    try {
      await addNewSection(newSectionName.value);
      // DEBUG:
      console.log('New section added successfully');
      closeEditSectionWindow();
    } catch (error) {
      console.error('Error adding new section:', error);
    }
  }
}

</script>

<style scoped>
.edit-section-label {
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