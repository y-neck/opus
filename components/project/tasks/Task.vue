<template>
  <div v-if="task.status_id !== 3">
    <div class="flex flex-row w-full justify-between group">
      <div class="flex items-center gap-2 h-[4.5rem]">
        <div class="-mt-5">
          <input
            type="checkbox"
            :checked="task.status_id === 3"
            @change="toggleTaskStatus"
            class="checkbox w-4 h-4 border-grey-700 border-[1.5px] rounded cursor-pointer checked:bg-grey-700"
          />
          <span
            v-if="task.status_id === 3"
            class="absolute -ml-[14.5px] mt-[3px]"
          >
            <CheckmarkIcon />
          </span>
        </div>
        <div class="flex flex-col">
          <p>{{ task.task }}</p>
          <div class="flex flex-row gap-1 text-grey-500 font-normal">
            <p>{{ format(new Date(task.due_date), "dd MMM yyyy") }}</p>
            <div
              class="flex flex-row gap-1"
              v-if="task.assignments && task.assignments.length > 0"
            >
              <span>·</span>
              <p
                v-for="assignment in task.assignments"
                :key="assignment.profile.id"
              >
                {{ assignment.profile.name }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        class="flex flex-row opacity-0 gap-1 mt-3 group-hover:opacity-100 transition"
      >
        <span
          class="w-5 h-5 flex justify-center items-center rounded cursor-pointer hover:bg-grey-100 text-grey-500 active:text-grey-950 transition"
        >
          <PencilIcon />
        </span>
        <span
          class="w-5 h-5 flex justify-center items-center rounded cursor-pointer hover:bg-grey-100 active:text-grey-950 text-grey-500 transition"
        >
          <DotsIcon />
        </span>
      </div>
    </div>
    <hr class="border-grey-100 w-full" />
  </div>
</template>

<script setup>
// Supabase Connection
const { supabase } = useSupabaseConnection();

import { format } from "date-fns";

const { task } = defineProps({
  task: Object,
});

// Toggle Task Status with delay
const toggleTaskStatus = async () => {
  // Show a temporary loading state
  task.isLoading = true;

  setTimeout(async () => {
    const newStatus = task.status_id === 1 ? 3 : 1;
    const { error } = await supabase
      .from("Tasks")
      .update({ status_id: newStatus })
      .eq("id", task.id);

    if (error) {
      console.error("Error updating task status:", error);
    } else {
      task.status_id = newStatus;
      console.log(`Current Status: ${newStatus}`);
    }

    // Hide the loading state after the delay
    task.isLoading = false;
  }, 150);
};
</script>

<style scoped>
.checkbox {
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  -o-appearance: none;
}
</style>
