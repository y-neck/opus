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
  flex-direction: column;
  justify-content: flex-start; /* Align items to the start */
  align-items: flex-start; /* Align items to the start */
  z-index: 1000; /* Ensure it covers other elements */
  gap: 0.5rem; /* Add gap between items for vertical alignment */
  border-radius: 0.5rem /* 8px */;
  width: fit-content;
}

.dropdown-menu {
  display: block;
  position: absolute;
  @apply bg-white;
  min-width: 10rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
  padding: 8px;
  border-radius: 0.5rem /* 8px */;
}

.dropdown-item {
  color: black;
  text-decoration: none;
  display: block;
}
</style>
