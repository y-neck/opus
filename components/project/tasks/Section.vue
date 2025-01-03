<template>
  <div class="mb-16 last:mb-0">
    <div class="flex justify-between items-center">
      <div class="flex flex-row items-center gap-3">
        <h1
          class="text-2xl mb-1"
          :style="{ color: sectionNames[sectionId]?.color || '#3F3F46' }"
        >
          {{ sectionNames[sectionId]?.title || "Untitled Section" }}
        </h1>
        <div
          class="flex items-center justify-center h-[18px] w-[18px] bg-grey-100 rounded font-semiBold"
        >
          <p class="text-xs">
            {{ tasks.filter((task) => task.status_id === 1).length }}
          </p>
        </div>
      </div>
      <span
        class="w-5 h-5 flex justify-center items-center rounded cursor-pointer hover:bg-grey-100 active:text-grey-950 text-grey-500 transition"
        @click="toggleDropdown"
      >
        <DotsIcon />
      </span>
      <div
        v-if="dropdownVisible"
        class="absolute bg-white rounded-lg border border-grey-100 right-[5.75rem] mt-[4.5rem] w-[11.25rem] z-10 px-4 py-2"
      >
        <ul>
          <li
            @click="deleteSection(props.sectionId)"
            class="cursor-pointer text-destructive-red hover:text-destructive-darkRed flex flex-row items-center gap-2"
          >
            <span class="-mt-0.5"><TrashCanIcon /></span>
            Delete Section
          </li>
        </ul>
      </div>
    </div>
    <hr class="border-grey-100" />
    <div>
      <div v-if="tasks.length > 0">
        <Task v-for="task in tasks" :key="task.id" :task="task" />
      </div>
      <div
        class="flex flex-row gap-2 items-center text-grey-500 pt-2 cursor-pointer max-w-24"
        @click="openCreateTaskModal"
      >
        <span><PlusIcon /></span>
        <p>Add Task</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const { supabase } = useSupabaseConnection();
import { ref } from "vue";
import Task from "./Task.vue";

const props = defineProps({
  sectionId: String,
  tasks: Array,
  sectionNames: Object,
});

const emit = defineEmits();

// Dropdown visibility state
const dropdownVisible = ref(false);

const toggleDropdown = () => {
  dropdownVisible.value = !dropdownVisible.value;
};

// Handle Section Deletion
const deleteSection = async (sectionId) => {
  const { data, error } = await supabase
    .from("Sections")
    .delete()
    .eq("id", sectionId);

  if (error) {
    throw error;
  }

  // Emit event to parent to update the sections list
  emit("sectionDeleted", sectionId);
};

// Open Create Task modal
const openCreateTaskModal = () => {
  emit("openCreateTaskModal", props.sectionId);
};
</script>
