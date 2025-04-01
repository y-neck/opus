<template>
  <div class="flex justify-center">
    <div
      v-if="message"
      class="flex items-center fixed bottom-0 bg-grey-100 text-grey-700 h-10 px-3 rounded-lg transform slide-animation"
    >
      <p>{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  message: String,
});
</script>

<style scoped>
@keyframes slide {
  0% {
    transform: translateY(1.75rem);
    filter: blur(4px);
    opacity: 0;
  }
  5% {
    filter: blur(1.75px);
    opacity: 0.5;
  }
  15% {
    transform: translateY(-1.75rem);
    filter: blur(0px);
    opacity: 1;
  }
  90% {
    transform: translateY(-1.75rem);
    filter: blur(0px);
    opacity: 1;
  }
  95% {
    filter: blur(1.75px);
    opacity: 0.5;
  }
  100% {
    transform: translateY(1.75rem);
    filter: blur(4px);
    opacity: 0;
  }
}

.slide-animation {
  animation: slide 3s ease-in-out;
}
</style>
