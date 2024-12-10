<template>
    <DropdownMenu id="project-dd">
                  <p>Select Project</p>
                  <p 
                  v-for="project in projectTasks" 
                  :key="project.projectId" 
                  role="menuitem" 
                  :class="['dropdown-menu-item', { active: project.projectId === projectStore.activeProjectId }]"
                  @click="setActiveProject(project.projectId as number)"
                  >
                    {{ project.projectName }}
                  </p>
            </DropdownMenu>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import DropdownMenu from '~/components/DropdownMenu.vue';
/* Import projects */
import { useProjectStore } from '~/middleware/projectStore';  // Import pinia store
import type { Project } from '~/middleware/models/projectsETL';
import { getProjects } from '~/middleware/projectMiddleware';

// Initialize pinia store
const projectStore=useProjectStore();
// Use pinia store state and actions, destructure reactive properties from store
const {activeProjectId} = projectStore;
// Set active project
const setActiveProject = (projectId: number) => {
  projectStore.setActiveProject(projectId);
  // // DEBUG:
  // console.log(`Set active project: ${activeProjectId}`);
};

// Watch for changes in active project
watch (
  () => projectStore.activeProjectId, 
  (newValue) => {
    // DEBUG:
    console.log(`Watcher: Active project changed to: ${newValue}`);
  } )

// Reactive reference to active project
const projectTasks = ref<Project[]>([]);
onMounted(async () => {
    try{
    // Fetch projects data from DB
    projectTasks.value = await getProjects();
    projectTasks.value = [...projectTasks.value]; // Enforcing reactivity
    // DEBUG:
    console.log('Project tasks from projectETL:', projectTasks.value);}
    catch(error){
        console.error('Error fetching projects:', error);
    }
});

// // Use pinia store state and actions
// const activeProjectId = projectStore.activeProjectId;
// const setActiveProject = (projectId: number) => {
//   projectStore.setActiveProject(projectId);
//   // DEBUG:
//   console.log(`Set active project: ${activeProjectId}`);
// };

/* Handle dropdown */
import {
  isDropdownVisible,
  toggleDropdown,
} from '~/src/functions/handleDropdown';
</script>

<style scoped>
.dropdown-menu-item {
  @apply flex items-center gap-2;
}
.dropdown-menu-item:hover {
  @apply cursor-pointer bg-grey-100;
}
.active {
  @apply bg-grey-200; /* Highlight active project */
}
</style>