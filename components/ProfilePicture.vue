<template>
  <div>
    <NuxtImg
      id="profile-img"
      :src="props.src"
      class="rounded-full bg-grey-100"
      width="64"
      height="64"
      :placeholder="[64, 64]"
      fit="cover"
      alt="Profile Picture"
      loading="lazy"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  src: String,
});
</script>
