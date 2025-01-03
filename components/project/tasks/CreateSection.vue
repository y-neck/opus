<template>
  <div
    v-if="isModalOpen"
    class="fixed inset-0 z-10 flex items-center justify-center bg-white bg-opacity-70 backdrop-blur-sm transition-all"
  >
    <div class="bg-white rounded-lg py-6 px-8 w-[656px] border border-grey-100">
      <h2 class="text-2xl mb-7 tracking-[0.005em]">Add a new section</h2>
      <form @submit.prevent="handleSubmit">
        <div class="flex flex-col gap-5">
          <div class="flex flex-col gap-1">
            <label for="title" class="text-grey-500 text-sm"
              >Section Title</label
            >
            <input
              v-model="newSectionTitle"
              id="title"
              type="text"
              required
              class="border border-grey-100 h-9 w-[396px] placeholder:text-grey-400 pl-3 rounded-lg"
              placeholder="Publishing"
            />
          </div>
          <div class="flex flex-col gap-1">
            <label for="color" class="text-grey-500 text-sm">Color</label>
            <input
              v-model="newSectionColor"
              id="color"
              type="color"
              class="h-9 w-40 border border-grey-100 rounded-lg px-2.5 py-1 cursor-pointer"
            />
          </div>
        </div>
        <div class="flex gap-2 justify-end mt-[4.5rem]">
          <button
            type="button"
            @click="closeModal"
            class="px-4 py-2 text-grey-500 rounded-lg"
          >
            Cancel
          </button>
          <button
            @click="openCreateSectionModal"
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
import { ref, watch } from "vue";

const props = defineProps({
  isModalOpen: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["create-section", "close-modal"]);

watch(
  () => props.isModalOpen,
  (newValue) => {
    console.log("CreateSection.vue - Modal open state changed:", newValue);
  }
);

const newSectionTitle = ref("");
const newSectionColor = ref("#4f46e5"); // Default color

const handleSubmit = () => {
  console.log("CreateSection.vue - Form submitted:", {
    title: newSectionTitle.value,
    color: newSectionColor.value,
  });

  if (!newSectionTitle.value.trim()) return;

  emit("create-section", {
    title: newSectionTitle.value,
    color: newSectionColor.value,
  });

  newSectionTitle.value = "";
  newSectionColor.value = "#4f46e5";
  closeModal();
};

const closeModal = () => {
  console.log("CreateSection.vue - Closing modal");
  emit("close-modal");
};
</script>

<style scoped></style>
