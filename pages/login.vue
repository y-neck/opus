<template>
  <LoginForm />
</template>

<script setup>
import LoginForm from "~/components/auth/forms/LoginForm.vue";

definePageMeta({
  layout: false,
});

useSeoMeta({
  title: "Opus · Login",
  ogTitle: "Login",
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
