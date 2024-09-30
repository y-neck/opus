<template>
  <div class="dropdown-overlay" :id="props.id" :class="props.class">
    <div class="dropdown-menu">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ id: String, class: String });
const isVisible = ref(false);
</script>

<style scoped>
.dropdown-overlay {
  display: flex; /* Ensure it uses flexbox for alignment */
  justify-content: flex-start; /* Align items to the start */
  align-items: flex-start; /* Align items to the start */
  z-index: 1000; /* Ensure it covers other elements */
}

.dropdown-menu {
  display: block;
  position: absolute;
  @apply bg-white;
  min-width: 10rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.dropdown-item {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}
</style>
