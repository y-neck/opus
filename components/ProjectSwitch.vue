<template>
  <div>
    <button 
      id="project-dd" 
      class="dropdown-menu-button flex items-center justify-between px-4 py-2 border-2 border-grey-100 rounded-md" 
      @click="toggleDropdown('project-dd')">
      <span class="chevron">▼</span>
      <span>{{ activeProjectName || 'Select Project' }}</span>
    </button>
  <!-- Dropdown Options -->
    <DropdownMenu 
      id="project-dd-container"
      v-show="isDropdownVisible['project-dd']"
      class="dropdown-menu-options">
      <p 
        v-for="project in projectTasks" 
        :key="project.projectId" 
        role="menuitem" 
        :class="['dropdown-menu-item px-1 truncate', { active: project.projectId === projectStore.activeProjectId }]"
        @click="setActiveProject(project.projectId as number, project.projectName as string)"
        >
        
          {{ project.projectName }}
      </p>
    </DropdownMenu>
  </div>
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
const activeProjectName = computed(() => projectStore.activeProjectName);
// Set active project in store
const setActiveProject = (projectId: number, projectName: string) => {
  projectStore.setActiveProject(projectId, projectName);
  // // DEBUG:
  // console.log(`Set active project: ${activeProjectId}`);
  toggleDropdown('project-dd');
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

/* Handle dropdown */
import {
  isDropdownVisible,
  toggleDropdown,
} from '~/src/functions/handleDropdown';
</script>

<style scoped>
.dropdown-menu{
  @apply border-grey-100 border-2 rounded-md;
}
.dropdown-menu-item :not(:first){
  @apply flex items-center;
}
.dropdown-menu-item:hover {
  @apply cursor-pointer bg-grey-100 rounded-md;
}
.active {
  @apply bg-grey-200 rounded-md; /* Highlight active project */
}
</style>