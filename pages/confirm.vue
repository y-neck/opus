<script setup>
const router = useRouter()

setTimeout(() => {
  router.push('/login')
}, 3000);

definePageMeta({
  title: 'Email confirmed',
  description: '',
  layout: false,
});
</script>

<template>
  <div class="flex items-center justify-center h-screen">
    <p class="flex text-center text-grey-700">
      Thank you for confirming your email.<br>
      You will be redirected to the login page shortly.
    </p>
  </div>
</template>
