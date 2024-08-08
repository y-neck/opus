<script setup lang="ts">
const user = useSupabaseUser()

watch(user, () => {
  if (user.value) {
    return navigateTo('/')
  }
}, { immediate: true })

definePageMeta({
  title: 'Confirm Login',
  description: '',
  layout: false,
});
</script>

<template>
  <div>Waiting for login...</div>
</template>
