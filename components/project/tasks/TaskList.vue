<template>
  <div class="task-list">
    <div v-if="isLoading" class="loading-indicator">
      <p>
        <!-- Switch to Skeleton Loading -->
        Loading tasks...
      </p>
    </div>
    <div v-else>
      <div v-if="Object.keys(groupedTasks).length > 0">
        <Section
          v-for="(tasksInSection, sectionId) in groupedTasks"
          :key="sectionId"
          :sectionId="sectionId"
          :tasks="tasksInSection"
          :sectionNames="sectionNames"
        />
      </div>

      <div v-else>
        <p>No tasks available for this project.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Supabase Connection
const { supabase } = useSupabaseConnection();
import Section from "./Section.vue";

import { ref, onMounted, computed, watchEffect } from "vue";
import { useProjectStore } from "~/store/project";

const projectStore = useProjectStore();
const tasks = ref([]);
const isLoading = ref(true);
const groupedTasks = ref({});
const sectionNames = ref({});

const projectId = computed(() => projectStore.activeProjectId);

// Fetch Tasks, Assignments, and Profiles
const fetchData = async () => {
  if (!projectId.value) {
    return;
  }

  // Fetch all tasks for the current project
  const { data: tasksData, error: tasksError } = await supabase
    .from("Tasks")
    .select("*")
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

// Group Tasks by Section
const groupTasksBySection = () => {
  groupedTasks.value = {};
  tasks.value.forEach((task) => {
    const sectionId = task.section;
    if (!groupedTasks.value[sectionId]) {
      groupedTasks.value[sectionId] = [];
    }
    groupedTasks.value[sectionId].push(task);
  });
};

// Fetch Section Names
const fetchSectionNames = async () => {
  const { data, error } = await supabase
    .from("Sections")
    .select("id, title, color");

  if (error) {
    console.error("Error fetching section names:", error);
  } else {
    sectionNames.value = data.reduce((acc, section) => {
      acc[section.id] = {
        title: section.title,
        color: section.color,
      };
      return acc;
    }, {});
  }
};

onMounted(async () => {
  await fetchSectionNames();
  await fetchData();
});

watchEffect(() => {
  if (projectId.value) {
    fetchData();
  }
});
</script>
