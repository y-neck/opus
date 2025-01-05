<template>
  <div v-if="activeProjectName">
    <button
      id="project-dd"
      class="flex items-center justify-between gap-2"
      @click="toggleDropdown('project-dd')"
    >
      <span class="flex flex-row items-center gap-2" v-if="activeProjectName">
        <p>
          {{ activeProjectName }}
        </p>

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
      <NuxtLink
        to="/project/create"
        class="flex flex-row items-center gap-2 cursor-pointer"
      >
        <span><PlusIcon /></span> Create Project
      </NuxtLink>
      <p
        class="flex flex-row items-center gap-2 cursor-pointer text-destructive-red"
      >
        <span><TrashCanIcon /></span> Delete Project
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

import { ref, onMounted } from "vue";
import DropdownMenu from "~/components/common/DropdownMenu.vue";
import DropdownSkeleton from "~/components/skeletons/DropdownSkeleton.vue";

// Define Interface
interface Project {
  projectId: string | number;
  projectName: string;
  projectImage: string;
}

// Initialize pinia store
const projectStore = useProjectStore();
// Use pinia store state and actions, destructure reactive properties from store

const activeProjectName = computed(() => projectStore.activeProjectName);
// Set active project in store
const setActiveProject = (projectId: number, projectName: string) => {
  projectStore.setActiveProject(projectId, projectName);

  console.log(activeProjectName);

  toggleDropdown("project-dd");
};

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
.dropdown-menu-item :not(:first) {
  display: flex;
  align-items: center;
}

.active {
  background-color: #f4f4f5;
  padding: 0.25rem 0.625rem;
  margin-left: -0.5rem;
  border-radius: 0.5rem;
}
</style>
