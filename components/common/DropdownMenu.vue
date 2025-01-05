<template>
  <div :id="props.id" :class="props.class">
    <div
      class="flex flex-col gap-2 p-2 pl-[7px] w-[15.5rem] border border-grey-100 absolute bg-white rounded-lg -ml-[0.75rem] mt-2"
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
