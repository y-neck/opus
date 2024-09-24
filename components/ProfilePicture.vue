<template>
  <div>
    <NuxtImg
      id="profile-img"
      :width="props.imgWidth"
      height="auto"
      :src="props.src"
      class="rounded-full"
      placeholder
      alt="Profile Picture"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  imgWidth: String,
  src: String,
});
</script>

<style scoped></style>
