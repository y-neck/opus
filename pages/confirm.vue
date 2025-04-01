<script setup>
const router = useRouter();

setTimeout(() => {
  router.push("/login");
}, 3000);

definePageMeta({
  layout: false,
});

useSeoMeta({
  title: "Opus · Email Confirmed",
  ogTitle: "Email Confirmed",
  ogSiteName: "opus",
  ogType: "website",
  description:
    "Welcome to Opus – your project management solution for team projects!",
  ogDescription:
    "Welcome to Opus – your project management solution for team projects!",
  creator: "https://github.com/y-neck/ | https://github.com/kevinschaerer/",
  robots: "noindex, nofollow",
  ogImage: "",
});
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <div class="text-left">
      <h2 class="text-2xl text-grey-700">Email Confirmed</h2>
      <p class="text-grey-500 font-normal pt-0.5">
        Thank you for confirming your email.<br />
        You will be redirected to the login page shortly.
      </p>
    </div>
  </div>
</template>
