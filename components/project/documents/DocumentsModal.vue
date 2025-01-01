<template>
  <div
    class="fixed inset-0 z-10 flex items-center justify-center bg-white bg-opacity-70 backdrop-blur-sm transition-all"
    v-if="isOpen"
  >
    <div class="bg-white rounded-lg p-6 w-[656px] border border-grey-100">
      <h2 class="text-2xl font-medium mb-7 tracking-[0.005em]">{{ title }}</h2>
      <div class="flex flex-col gap-6">
        <div class="flex flex-col gap-1">
          <label for="link" class="text-grey-500 text-sm">Link</label>
          <input
            type="text"
            id="link"
            v-model="link"
            class="border border-grey-100 h-9 w-[396px] placeholder:text-grey-400 pl-3 rounded-lg"
            placeholder="https://docs.google.com"
          />
        </div>
        <div class="flex flex-col gap-1">
          <label for="description" class="text-grey-500 text-sm"
            >Description</label
          >
          <input
            type="text"
            v-model="description"
            id="description"
            class="border border-grey-100 h-9 w-[396px] placeholder:text-grey-400 pl-3 rounded-lg"
            placeholder="Google Docs for the documentation"
          />
        </div>
      </div>
      <div class="flex justify-end gap-3 mt-[4.5rem]">
        <button
          @click="cancel"
          class="px-4 py-2 text-grey-500 rounded-lg hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          @click="confirm"
          class="px-4 py-2 text-grey-50 rounded-lg bg-grey-700"
        >
          {{ label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// Props
const props = defineProps({
  isOpen: Boolean,
  title: String,
  message: String,
  label: String,
});

// Emit events
const emit = defineEmits(["confirm", "cancel"]);

// Local state for input fields
const link = ref("");
const description = ref("");

// Functions
function confirm() {
  emit("confirm", { link: link.value, description: description.value });
}

function cancel() {
  emit("cancel");
}
</script>
