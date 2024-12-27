<template>
  <button
    :disabled="disabled"
    class="w-[20rem] h-10 bg-grey-700 active:hover:bg-grey-800 text-grey-50 rounded-lg font-regular transition disabled:opacity-80 disabled:transition mt-4 font-medium"
    type="submit"
  >
    {{ title }}
  </button>
</template>

<script setup>
defineProps({
  title: String,
  disabled: Boolean,
});
</script>
