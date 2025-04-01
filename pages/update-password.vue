<template>
  <UpdatePasswordForm />
</template>

<script setup>
import UpdatePasswordForm from "~/components/auth/forms/UpdatePasswordForm.vue";

definePageMeta({
  layout: false,
});

useSeoMeta({
  title: "Opus · Update Password",
  ogTitle: "Update Password",
  ogSiteName: "opus",
  ogType: "website",
  description:
    "Change your profile picture, update your email address, and more!",
  ogDescription:
    "Change your profile picture, update your email address, and more!",
  creator: "https://github.com/y-neck/ | https://github.com/kevinschaerer/",
  robots: "noindex, nofollow",
  ogImage: "",
});
</script>
