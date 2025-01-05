<template>
  <div v-if="activeProjectName">
    <button
      id="project-dd"
      class="flex items-center justify-between gap-2 hover:bg-grey-100 h-9 px-3 rounded-lg -ml-3"
      @click="toggleDropdown('project-dd')"
      :class="{ 'bg-grey-100': isDropdownVisible['project-dd'] }"
    >
      <span class="flex flex-row items-center gap-2" v-if="activeProjectName">
        <component class="-mt-0.5" :is="activeProjectIcon" />
        <p>{{ activeProjectName }}</p>
        <span class="-ml-1"><ChevronDownIcon /></span>
      </span>
      <span v-else="DropdownSkeleton"><DropdownSkeleton /></span>
    </button>
    <DropdownMenu
      id="project-dd-container"
      v-show="isDropdownVisible['project-dd']"
    >
      <p
        v-for="project in projectTasks"
        :key="project.projectId"
        role="menuitem"
        :class="[
          'dropdown-menu-item px-1 truncate cursor-pointer flex flex-row gap-2 items-center hover:text-grey-900',
          { active: project.projectId === projectStore.activeProjectId },
        ]"
        @click="
          setActiveProject(
            project.projectId as number,
            project.projectName as string,
            project.projectIcon as string
          )
        "
      >
        <component class="-mt-0.5" :is="project.projectIcon" />
        {{ project.projectName }}
      </p>
      <hr class="border-grey-100" />
      <NuxtLink
        to="/project/create"
        class="flex flex-row items-center gap-2 cursor-pointer pl-1 hover:text-grey-900"
      >
        <span class="-mt-0.5"><PlusIcon /></span> Create Project
      </NuxtLink>
      <p
        class="flex flex-row items-center gap-2 cursor-pointer pl-1 text-destructive-red hover:text-destructive-darkRed"
      >
        <span class="-mt-0.5"><TrashCanIcon /></span> Delete Project
      </p>
    </DropdownMenu>
  </div>
  <div v-else>
    <NuxtLink class="flex flex-row gap-2 items-center" to="/project/create"
      ><span><PlusIcon /></span> Create Project</NuxtLink
    >
  </div>
</template>

<script setup lang="ts">
import { useProjectStore } from "~/middleware/store/project";
import { getProjects } from "~/middleware/store/projectService";

import { ref, computed, onMounted } from "vue";
import DropdownMenu from "~/components/common/DropdownMenu.vue";
import DropdownSkeleton from "~/components/skeletons/DropdownSkeleton.vue";

// Define Interface
interface Project {
  projectId: string | number;
  projectName: string;
  projectIcon: string;
}

// Initialize pinia store
const projectStore = useProjectStore();

// Use pinia store state and actions, destructure reactive properties from store
const activeProjectName = computed(() => projectStore.activeProjectName);
const activeProjectIcon = computed(() => projectStore.activeProjectIcon);

// Set active project in store
const setActiveProject = (
  projectId: number,
  projectName: string,
  projectIcon: string
) => {
  projectStore.setActiveProject(projectId, projectName, projectIcon);
  toggleDropdown("project-dd");
};

// Reactive reference to active project
const projectTasks = ref<Project[]>([]);

onMounted(async () => {
  try {
    // Fetch projects data from DB
    projectTasks.value = await getProjects();

    if (projectTasks.value.length > 0 && !projectStore.activeProjectId) {
      // Set the first project as active if there's no active project
      const firstProject = projectTasks.value[0];
      setActiveProject(
        firstProject.projectId as number,
        firstProject.projectName,
        firstProject.projectIcon
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
.dropdown-menu-item :not(:first) {
  display: flex;
  align-items: center;
}

.active {
  background-color: #f4f4f5;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  padding-right: 0.5rem;
  padding-left: 0.25rem;
  border-radius: 0.5rem;
  color: #3f3f46;
}

.active:hover {
  color: #3f3f46;
}
</style>
