<template>
  <RegisterForm />
</template>

<script setup>
import RegisterForm from "~/components/auth/forms/RegisterForm.vue";

definePageMeta({
  layout: false,
});

useSeoMeta({
  title: "Opus · Register",
  ogTitle: "Register",
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
