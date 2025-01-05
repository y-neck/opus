<template>
  <div
    class="fixed inset-0 z-10 flex items-center justify-center bg-white bg-opacity-70 backdrop-blur-sm transition-all"
  >
    <div class="bg-white rounded-lg py-6 px-8 w-[656px] border border-grey-100">
      <h2 class="text-2xl mb-7 tracking-[0.005em]">Add a new task</h2>
      <form @submit.prevent="createTask">
        <div class="flex flex-col gap-1">
          <label class="text-grey-500 text-sm" for="taskName">Task</label>
          <input
            v-model="taskName"
            id="taskName"
            type="text"
            class="w-[24.75rem] pl-3 h-9 border border-grey-100 rounded-lg placeholder:font-base"
            placeholder="Film Wildlife Footage"
            required
          />
        </div>
        <div class="flex flex-row mt-4 gap-2">
          <div class="flex flex-col gap-1">
            <label class="text-grey-500 text-sm" for="taskName">Section</label>
            <div
              class="h-9 bg-grey-100 px-3 flex items-center rounded-lg text-grey-500"
            >
              <p>
                {{ sectionNames[sectionId]?.title || "Unknown" }}
              </p>
            </div>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-grey-500 text-sm" for="taskName">Due Date</label>
            <input
              v-model="dueDate"
              id="dueDate"
              type="date"
              class="h-9 border border-grey-100 rounded-lg"
              placeholder="Due Date"
              :min="today"
              required
            />
          </div>
        </div>
        <div>
          <div class="flex flex-col gap-2 mt-4">
            <label class="text-grey-500 text-sm" for="taskName"
              >Assign to</label
            >
            <div class="flex flex-row gap-1.5">
              <button
                v-for="member in projectMembers"
                :key="member.id"
                :class="
                  selectedMembers.includes(member.id)
                    ? 'bg-grey-100'
                    : 'bg-white'
                "
                class="rounded-full border border-grey-100 h-9 px-3 focus:bg-grey-100"
                @click="toggleMemberSelection(member.id)"
                type="button"
              >
                {{ member.name }}
              </button>
            </div>
          </div>
        </div>
        <div class="flex gap-2 justify-end mt-[4.5rem]">
          <button
            @click="closeModal"
            class="px-4 py-2 text-grey-500 rounded-lg"
          >
            Close
          </button>
          <button
            type="submit"
            class="px-4 py-2 text-grey-50 rounded-lg bg-grey-700"
          >
            Create
          </button>
        </div>
      </form>
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
const selectedMembers = ref([]);

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

const date = new Date();
const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, "0");
const day = String(date.getDate()).padStart(2, "0");

const today = `${year}-${month}-${day}`;

console.log(today);

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
