<template>
  <div class="task-list">
    <div v-if="isLoading" class="loading-indicator">
      <p>Loading tasks...</p>
    </div>
    <div v-else>
      <div v-if="Object.keys(sectionNames).length > 0">
        <Section
          v-for="(section, sectionId) in sectionNames"
          :key="sectionId"
          :sectionId="sectionId"
          :tasks="groupedTasks[sectionId] || []"
          :sectionNames="sectionNames"
          @sectionDeleted="handleSectionDeleted"
          @openCreateTaskModal="openCreateTaskModal"
        />
      </div>

      <div v-else>
        <p>No sections available for this project.</p>
      </div>
    </div>
    <CreateSection
      :isModalOpen="isAddSectionModalOpen"
      @create-section="createSection"
      @close-modal="isAddSectionModalOpen = false"
    />
    <CreateTask
      v-if="isModalOpen"
      :projectId="projectId"
      :sectionId="currentSectionId"
      :sectionNames="sectionNames"
      :projectMembers="projectMembers"
      @taskCreated="fetchData"
      @closeModal="closeCreateTaskModal"
    />
  </div>
</template>

<script setup>
const { supabase } = useSupabaseConnection();

import { ref, computed, onMounted, watchEffect, watch } from "vue";
import { useProjectStore } from "~/store/project";
import Section from "./Section.vue";
import CreateTask from "./CreateTask.vue";
import CreateSection from "./CreateSection.vue";

const projectStore = useProjectStore();
const projectId = computed(() => projectStore.activeProjectId);

const tasks = ref([]);
const isLoading = ref(true);
const groupedTasks = ref({});
const sectionNames = ref({});
const projectMembers = ref([]);
const currentSectionId = ref(null);
const isModalOpen = ref(false);
const closeCreateSectionModal = ref(false);
const isAddSectionModalOpen = ref(false);

const emit = defineEmits(["closeAddSectionModal"]);

// Fetch Tasks, Assignments, and Profiles
const fetchData = async () => {
  if (!projectId.value) {
    console.error("Project ID is not set.");
    return;
  }

  // Fetch all tasks for the project (using the project ID)
  const { data: tasksData, error: tasksError } = await supabase
    .from("Tasks")
    .select("*")
    .order("due_date", { ascending: true })
    .eq("projects_id", projectId.value);

  if (tasksError) {
    console.error("Error fetching tasks:", tasksError);
    return;
  }

  // Fetch all assignments for the project
  const { data: assignments, error: assignmentsError } = await supabase
    .from("Assignments")
    .select("task_id, profile_id");

  if (assignmentsError) {
    console.error("Error fetching assignments:", assignmentsError);
    return;
  }

  // Fetch profiles for the assignments
  const profileIds = assignments.map((a) => a.profile_id);
  const { data: profiles, error: profilesError } = await supabase
    .from("Profiles")
    .select("id, name")
    .in("id", profileIds);

  if (profilesError) {
    console.error("Error fetching profiles:", profilesError);
    return;
  }

  // Merge tasks and profiles with assignments
  tasksData.forEach((task) => {
    task.assignments = assignments.filter((a) => a.task_id === task.id);
    task.assignments.forEach((a) => {
      a.profile = profiles.find((p) => p.id === a.profile_id);
    });
  });

  tasks.value = tasksData;
  groupTasksBySection();
  isLoading.value = false;
};

// Group tasks by section
const groupTasksBySection = () => {
  groupedTasks.value = tasks.value.reduce((acc, task) => {
    const sectionId = task.section;
    if (!acc[sectionId]) {
      acc[sectionId] = [];
    }
    acc[sectionId].push(task);
    return acc;
  }, {});
};

// Fetch project members
const fetchProjectMembers = async () => {
  if (!projectId.value) return;

  const { data, error } = await supabase
    .from("Members")
    .select(
      `
      id,
      Profiles (
        id,
        name
      )
    `
    )
    .eq("project_id", projectId.value);

  if (error) {
    console.error("Error fetching project members:", error);
    return;
  }

  projectMembers.value = data.map((member) => ({
    id: member.Profiles.id,
    name: member.Profiles.name,
  }));
};

// Fetch section names
const fetchSectionNames = async () => {
  if (!projectId.value) {
    console.error(
      "Project ID is null or undefined. Cannot fetch section names."
    );
    return;
  }

  try {
    const { data, error } = await supabase
      .from("Sections")
      .select("id, title, color")
      .eq("project_id", projectId.value);

    if (error) throw error;

    sectionNames.value = data.reduce((acc, section) => {
      acc[section.id] = { title: section.title, color: section.color };
      return acc;
    }, {});
  } catch (error) {
    console.error("Error fetching sections:", error);
  }
};

// Handle section deletion
const handleSectionDeleted = (sectionId) => {
  delete sectionNames.value[sectionId];
  delete groupedTasks.value[sectionId];
};

const openCreateTaskModal = (sectionId) => {
  currentSectionId.value = sectionId;
  isModalOpen.value = true;
};

const closeCreateTaskModal = () => {
  isModalOpen.value = false;
};

const createSection = async ({ title, color }) => {
  if (!title || !projectId.value) return;

  try {
    const { error } = await supabase.from("Sections").insert([
      {
        title,
        color,
        project_id: projectId.value,
      },
    ]);

    if (error) throw error;

    await fetchSectionNames();
    isAddSectionModalOpen.value = false;
  } catch (error) {
    console.error("Error creating section:", error);
  }
};

onMounted(async () => {
  if (projectId.value) {
    await fetchSectionNames();
    await fetchData();
    await fetchProjectMembers();
  }
});

watchEffect(() => {
  if (projectId.value) {
    fetchSectionNames();
    fetchData();
    fetchProjectMembers();
  }
});
</script>
