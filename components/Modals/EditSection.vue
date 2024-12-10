<template>
  <div
            id="edit-section-backdrop"
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
                  :placeholder="section?.name || 'Edit section name'"
                />
                <div id="more-section-actions" class="flex gap-2">
                  <label for="add-section" class="edit-section-label">Add new section:</label>
                <input
                  id="add-section"
                  class="w-full h-12 border border-grey-100 rounded-md px-3 placeholder:text-grey-400"
                  type="text"
                  :placeholder="'New section name'"
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
import TrashCanIcon from '../icons/TrashCanIcon.vue';

// Props
const props = defineProps({
  project: Object,
  section: Object,
})

/* Handle edit-section-window */
function saveSectionEdits() {
  
}
    // TODO: db logic

// Close new-task-window
function closeEditSectionWindow() {
  const editSectionWindow =
    document.querySelector<HTMLDivElement>('#edit-section-backdrop');
  if (editSectionWindow) {
    editSectionWindow.classList.add('hidden');
  }
}

// Close new-task-window on escape-key
onMounted(() => {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelector('#edit-section-backdrop')?.classList.add('hidden');
    }
  });
});
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