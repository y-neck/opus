<template>
  <div class="flex flex-col">
    <div>
      <p>Hello world</p>
    </div>
  </div>
</template>

<script setup>
const loading = ref(true)

loading.value = true
const user = useSupabaseUser()

console.log(user)

definePageMeta({
  title: 'Home',
  description: '',
  layout: 'default',
});
</script>

<style scoped></style>
