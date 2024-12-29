<script setup>
const router = useRouter();

setTimeout(() => {
  router.push("/login");
}, 3000);

definePageMeta({
  title: "Email confirmed",
  description: "",
  layout: false,
});
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <div class="text-left">
      <h2 class="text-2xl text-grey-700">Email Confirmed</h2>
      <p class="text-grey-500 font-normal leading-[1.375rem] pt-0.5">
        Thank you for confirming your email.<br />
        You will be redirected to the login page shortly.
      </p>
    </div>
  </div>
</template>
