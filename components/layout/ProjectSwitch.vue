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
            project.projectId,
            project.projectName,
            project.projectIcon,
            project.createdBy
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
        v-if="isOwner"
        class="flex flex-row items-center gap-2 cursor-pointer pl-1 text-destructive-red hover:text-destructive-darkRed"
        @click="deleteProject"
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

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useProjectStore } from "~/middleware/store/project";
import { getProjects } from "~/middleware/store/projectService";
import DropdownMenu from "~/components/common/DropdownMenu.vue";
import DropdownSkeleton from "~/components/skeletons/DropdownSkeleton.vue";
const { supabase, user } = useSupabaseConnection();

const projectStore = useProjectStore();
const activeProjectName = computed(() => projectStore.activeProjectName);
const activeProjectIcon = computed(() => projectStore.activeProjectIcon);

const projectTasks = ref([]);
const isOwner = ref(false);

const setActiveProject = async (
  projectId,
  projectName,
  projectIcon,
  createdBy
) => {
  projectStore.setActiveProject(projectId, projectName, projectIcon, createdBy);
  toggleDropdown("project-dd");
};

const checkOwnership = async () => {
  if (user?.id && projectStore.activeProjectCreatedBy) {
    try {
      const { data, error } = await supabase
        .from("Profiles")
        .select("user_id")
        .eq("id", projectStore.activeProjectCreatedBy)
        .single();

      if (error) {
        console.error("Error fetching project owner:", error);
      } else if (data && data.user_id === user.id) {
        isOwner.value = true;
      } else {
        isOwner.value = false;
      }
    } catch (error) {
      console.error("Error checking ownership:", error);
    }
  }
};

// Function to delete a project
const deleteProject = async () => {
  if (projectStore.activeProjectId) {
    try {
      const { error } = await supabase
        .from("Projects")
        .delete()
        .eq("id", projectStore.activeProjectId);

      if (error) {
        console.error("Error deleting project:", error);
      } else {
        // After deletion, reset the active project and refetch project list
        projectStore.setActiveProject(null, null, null, null);

        // Refetch the list of projects
        projectTasks.value = await getProjects();

        // If there are any remaining projects, set the first one as the new active project
        if (projectTasks.value.length > 0) {
          const firstProject = projectTasks.value[0];
          await setActiveProject(
            firstProject.projectId,
            firstProject.projectName,
            firstProject.projectIcon,
            firstProject.createdBy
          );
        }

        toggleDropdown("project-dd");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  }
};

onMounted(async () => {
  try {
    // Fetch initial list of projects
    projectTasks.value = await getProjects();

    // If no active project, set the first one as active
    if (projectTasks.value.length > 0 && !projectStore.activeProjectId) {
      const firstProject = projectTasks.value[0];
      await setActiveProject(
        firstProject.projectId,
        firstProject.projectName,
        firstProject.projectIcon,
        firstProject.createdBy
      );
    }

    // Check if the current user is the owner of the project
    await checkOwnership();
  } catch (error) {
    console.error("Error fetching projects:", error);
  }
});

watch(
  () => projectStore.activeProjectCreatedBy,
  async () => {
    await checkOwnership();
    projectTasks.value = await getProjects();
  }
);

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
