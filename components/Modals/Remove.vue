<template>
    <div class="fixed inset-0 z-10 flex items-center justify-center bg-grey-900 bg-opacity-20" v-if="isOpen">
      <div class="bg-white rounded-lg p-6 w-[496px] border border-grey-100">
        <h2 class="text-2xl font-medium mb-1 tracking-[0.005em]">{{ title }}</h2>
        <p class="text-grey-500 mb-14">{{ message }}</p>
        <div class="flex justify-end gap-3">
          <button @click="cancel" class="px-4 py-2 text-grey-500 rounded-lg hover:bg-gray-300">Cancel</button>
          <button @click="confirm" class="px-4 py-2 text-grey-100 rounded-lg bg-destructive-red hover:bg-destructive-darkRed">Delete</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    isOpen: Boolean,
    title: String,
    message: String,
  });
  
  const emit = defineEmits(['confirm', 'cancel']);
  
  function confirm() {
    emit('confirm');
  }
  
  function cancel() {
    emit('cancel');
  }
  </script>