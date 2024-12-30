<template>
  <div>
    <button
      id="project-dd"
      class="dropdown-menu-button flex items-center justify-between gap-2 rounded-md"
      @click="toggleDropdown('project-dd')"
    >
      <!-- TODO: Replace icon with variable. -->
      <span> <PlantIcon /></span>
      <p v-if="activeProjectName">
        {{ activeProjectName }}
      </p>
      <span v-else="DropdownSkeleton"> <DropdownSkeleton /> </span>
      <span class="-ml-1"> <ChevronDownIcon /></span>
    </button>
    <!-- Dropdown Options -->
    <DropdownMenu
      id="project-dd-container"
      v-show="isDropdownVisible['project-dd']"
      class="dropdown-menu-options"
    >
      <p
        v-for="project in projectTasks"
        :key="project.projectId"
        role="menuitem"
        :class="[
          'dropdown-menu-item px-1 truncate cursor-pointer',
          { active: project.projectId === projectStore.activeProjectId },
        ]"
        @click="
          setActiveProject(
            project.projectId as number,
            project.projectName as string
          )
        "
      >
        {{ project.projectName }}
      </p>
      <hr class="border-grey-100" />
      <p class="flex flex-row items-center gap-2 cursor-pointer">
        <span><PlusIcon /></span> Create Project
      </p>
      <p
        class="flex flex-row items-center gap-2 cursor-pointer text-destructive-red"
      >
        <span><TrashCanIcon /></span> Delete Project
      </p>
    </DropdownMenu>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import DropdownMenu from "~/components/DropdownMenu.vue";
import DropdownSkeleton from "~/components/Skeleton/DropdownSkeleton.vue";
/* Import projects */
import { useProjectStore } from "~/middleware/projectStore"; // Import pinia store
import type { Project } from "~/middleware/models/projectsETL";
import { getProjects } from "~/middleware/projectMiddleware";

// Initialize pinia store
const projectStore = useProjectStore();
// Use pinia store state and actions, destructure reactive properties from store
const { activeProjectId } = projectStore;
const activeProjectName = computed(() => projectStore.activeProjectName);
// Set active project in store
const setActiveProject = (projectId: number, projectName: string) => {
  projectStore.setActiveProject(projectId, projectName);
  // // DEBUG:
  // console.log(`Set active project: ${activeProjectId}`);
  toggleDropdown("project-dd");
  // Redirect to tasks page if not already on tasks page
  if (window.location.pathname === "/task-overview") {
    navigateTo("/tasks");
  }
};

// Watch for changes in active project
watch(
  () => projectStore.activeProjectId,
  (newValue) => {
    // // DEBUG:
    // console.log(`Watcher: Active project changed to: ${newValue}`);
  }
);

// Reactive reference to active project
const projectTasks = ref<Project[]>([]);
onMounted(async () => {
  try {
    // Fetch projects data from DB
    projectTasks.value = await getProjects();

    if (projectTasks.value.length > 0 && !projectStore.activeProjectId) {
      const firstProject = projectTasks.value[0];
      setActiveProject(
        firstProject.projectId as number,
        firstProject.projectName
      );

      isDropdownVisible.value["project-dd"] = false;
    }
  } catch (error) {
    console.error("Error fetching projects:", error);
  }
});

/* Handle dropdown */
import {
  isDropdownVisible,
  toggleDropdown,
} from "~/src/functions/handleDropdown";
</script>

<style scoped>
.dropdown-menu {
  @apply border-grey-100 border-2 rounded-md;
}
.dropdown-menu-item :not(:first) {
  @apply flex items-center;
}

.active {
  @apply bg-grey-100 py-1 px-2.5 -ml-2 rounded-lg; /* Highlight active project */
}
</style>
