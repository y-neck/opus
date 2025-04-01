<template>
  <PasswordRecoveryForm />
</template>

<script setup>
import PasswordRecoveryForm from "~/components/auth/forms/PasswordRecoveryForm.vue";

definePageMeta({
  layout: false,
});

useSeoMeta({
  title: "Opus · Password Recovery",
  ogTitle: "Password Recovery",
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
