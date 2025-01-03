<template>
  <div
    class="fixed inset-0 z-10 flex items-center justify-center bg-white bg-opacity-70 backdrop-blur-sm transition-all"
  >
    <div class="bg-white rounded-lg py-6 px-8 w-[656px] border border-grey-100">
      <h2 class="text-2xl">Add a new task</h2>
      <form @submit.prevent="createTask">
        <div class="flex flex-col">
          <label class="text-sm" for="taskName">Task</label>
          <input
            v-model="taskName"
            id="taskName"
            type="text"
            class="w-[24.75rem] pl-3 h-9 border border-grey-100 rounded-lg placeholder:font-base"
            placeholder="Film Wildlife Footage"
            required
          />
        </div>
        <div class="flex flex-row">
          <div
            class="h-9 bg-grey-100 px-3 flex items-center rounded-lg text-grey-500"
          >
            <p>
              {{ sectionNames[sectionId]?.title || "Unknown" }}
            </p>
          </div>
          <div>
            <input
              v-model="dueDate"
              id="dueDate"
              type="date"
              class="h-9 border border-grey-100 rounded-lg"
              placeholder="Due Date"
              required
            />
          </div>
        </div>
        <div>
          <div class="flex gap-2">
            <button
              v-for="member in projectMembers"
              :key="member.id"
              :class="{ selected: selectedMembers.includes(member.id) }"
              class="rounded-full border border-grey-100 h-9 px-3 focus:bg-grey-100"
              @click="toggleMemberSelection(member.id)"
              type="button"
            >
              {{ member.name }}
            </button>
          </div>
        </div>
        <button type="submit">Create Task</button>
      </form>
      <button @click="closeModal">Close</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// Props passed from parent
const props = defineProps({
  projectId: {
    type: Number,
    required: true,
  },
  sectionId: {
    type: String,
    required: true,
  },
  sectionNames: {
    type: Object,
    required: true,
  },
  projectMembers: {
    type: Array,
    required: true,
  },
});

// Emit events to parent
const emit = defineEmits(["taskCreated", "closeModal"]);

// Reactive state for form fields
const taskName = ref("");
const dueDate = ref("");
const selectedMembers = ref([]); // Store selected member IDs

// Supabase connection
const { supabase } = useSupabaseConnection();

// Toggle member selection
const toggleMemberSelection = (memberId) => {
  if (selectedMembers.value.includes(memberId)) {
    selectedMembers.value = selectedMembers.value.filter(
      (id) => id !== memberId
    );
  } else {
    selectedMembers.value.push(memberId);
  }
};

// Function to create a task and assign members
const createTask = async () => {
  if (!taskName.value || !dueDate.value) return;

  try {
    const { data: taskData, error: taskError } = await supabase
      .from("Tasks")
      .insert([
        {
          task: taskName.value,
          due_date: dueDate.value,
          section: props.sectionId,
          projects_id: props.projectId,
          status_id: 1,
        },
      ])
      .select();

    if (taskError) {
      console.error("Error creating task:", taskError);
      return;
    }

    const taskId = taskData[0]?.id;

    if (selectedMembers.value.length > 0 && taskId) {
      const assignments = selectedMembers.value.map((memberId) => ({
        task_id: taskId,
        profile_id: memberId,
      }));

      const { error: assignmentError } = await supabase
        .from("Assignments")
        .insert(assignments);

      if (assignmentError) {
        console.error("Error assigning members:", assignmentError);
      }
    }

    taskName.value = "";
    dueDate.value = "";
    selectedMembers.value = [];
    emit("taskCreated", taskData);
    emit("closeModal");
  } catch (err) {
    console.error("Unexpected error:", err);
  }
};

// Close modal function
const closeModal = () => {
  emit("closeModal");
};
</script>

<style scoped>
input[type="date"]::-webkit-calendar-picker-indicator {
  display: none;
}
</style>
