<template>
  <button
    :disabled="disabled"
    class="w-[20rem] h-10 bg-grey-700 hover:bg-grey-800 text-grey-50 rounded-lg font-regular transition disabled:bg-grey-100 disabled:text-grey-300 disabled:transition mt-2 font-medium"
    type="submit"
  >
    <div v-if="loading" class="flex justify-center items-center">
      <VueSpinnerIos size="20" color="#fafafa" stroke-width="20px" />
    </div>
    <span v-else>
      {{ label }}
    </span>
  </button>
</template>

<script setup>
import { VueSpinnerIos } from "vue3-spinners";

defineProps({
  label: String,
  disabled: Boolean,
  loading: Boolean,
});
</script>

<style scoped></style>
