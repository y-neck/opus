<template>
  <div :id="props.id" :class="props.class">
    <div
      class="flex flex-col gap-2 p-2 pl-4 w-[14rem] border border-grey-100 absolute bg-white rounded-lg"
      role="menu"
      aria-label="Dropdown Menu"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ id: String, class: String });
</script>
