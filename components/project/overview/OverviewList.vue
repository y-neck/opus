<template>
  <div class="p-16">
    <div v-if="isLoading">
      <TaskOverviewSkeleton />
      <TaskOverviewSkeleton class="mt-20" />
    </div>
    <div v-else-if="error" class="text-red-600">
      <p>{{ error }}</p>
    </div>
    <div v-else>
      <div v-if="Object.keys(groupedTasks).length > 0">
        <div
          v-for="(tasks, projectName) in groupedTasks"
          :key="projectName"
          class="mb-[4.5rem]"
        >
          <div class="flex flex-row items-center gap-3">
            <h1 class="text-2xl mb-1 text-grey-500">
              {{ projectName }}
            </h1>
            <div
              class="flex items-center justify-center h-[18px] w-[18px] bg-grey-100 rounded font-semiBold"
            >
              <p class="text-xs">
                {{ tasks.length }}
              </p>
            </div>
          </div>
          <hr class="border-grey-100 w-full" />
          <div v-for="task in tasks" :key="task.id">
            <div class="flex flex-col h-[4.5rem] justify-center">
              <p>{{ task.title }}</p>
              <p class="text-grey-500 font-normal">
                {{ formatDate(task.due_date) }} · {{ task.projectName }}
              </p>
            </div>
            <hr class="border-grey-100 w-full" />
          </div>
        </div>
      </div>
      <div v-else>
        <p>No tasks available.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import TaskOverviewSkeleton from "~/components/skeletons/TaskOverviewSkeleton.vue";

import { ref, onMounted } from "vue";
const { supabase, user } = useSupabaseConnection();

const tasks = ref([]);
const groupedTasks = ref({});
const isLoading = ref(true);
const error = ref(null);

const fetchTasks = async () => {
  try {
    isLoading.value = true;
    error.value = null;

    const { data: profilesId, error: profileError } = await supabase
      .from("Profiles")
      .select("id")
      .eq("user_id", user.id);

    if (profileError) {
      throw new Error("Error fetching profile: " + profileError.message);
    }

    if (!profilesId || profilesId.length === 0) {
      throw new Error("No profile found for user");
    }

    console.log(profilesId[0].id);

    const { data: userTasks, error: tasksError } = await supabase
      .from("Tasks")
      .select(
        `
    id,
    task,
    due_date,
    status_id,
    Projects (
      id,
      project_name,
      Members ( user_id )
    )
  `
      )
      .order("due_date", { ascending: true })
      .eq("status_id", 1);

    console.log(userTasks);

    if (tasksError) {
      throw new Error("Error fetching tasks: " + tasksError.message);
    }

    tasks.value = userTasks.filter((task) =>
      task.Projects?.Members?.some(
        (member) => member.user_id === profilesId[0].id
      )
    );

    console.log(tasks.value);

    tasks.value = tasks.value.map((task) => ({
      id: task.id,
      title: task.task,
      due_date: task.due_date,
      projectName: task.Projects?.project_name,
    }));

    groupedTasks.value = tasks.value.reduce((acc, task) => {
      if (!acc[task.projectName]) {
        acc[task.projectName] = [];
      }
      acc[task.projectName].push(task);
      return acc;
    }, {});
  } catch (err) {
    console.error("Error in fetchTasks:", err);
    error.value = err.message;
  } finally {
    isLoading.value = false;
  }
};

const formatDate = (date) => {
  if (!date) return "No due date";
  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

onMounted(fetchTasks);
</script>
