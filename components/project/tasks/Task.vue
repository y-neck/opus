<template>
  <div
    v-if="!isRemoved"
    :class="{ 'line-through text-grey-400': task.status_id === 3 }"
    class="transition-all duration-1000"
  >
    <div class="flex flex-row w-full justify-between group">
      <div class="flex items-center gap-2 h-[4.5rem]">
        <div class="-mt-5">
          <input
            type="checkbox"
            :checked="task.status_id === 3"
            @change="toggleTaskStatus"
            class="checkbox w-4 h-4 border-grey-700 border-[1.5px] rounded cursor-pointer checked:bg-grey-700"
          />
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
    </div>
    <hr class="border-grey-100 w-full" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { format } from "date-fns";
const { supabase } = useSupabaseConnection();

const emit = defineEmits(["taskCompleted"]);
const isRemoved = ref(false);

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
});

const toggleTaskStatus = async () => {
  try {
    const newStatus = props.task.status_id === 1 ? 3 : 1;

    const { error } = await supabase
      .from("Tasks")
      .update({ status_id: newStatus })
      .eq("id", props.task.id);

    if (error) throw error;

    props.task.status_id = newStatus;

    if (newStatus === 3) {
      setTimeout(() => {
        isRemoved.value = true;

        emit("taskCompleted", props.task.id);
      }, 1000);
    }
  } catch (error) {
    console.error("Error updating task status:", error);
  }
};
</script>

<style scoped>
.line-through {
  text-decoration-line: line-through;
  text-decoration-thickness: 2px;
}
</style>
