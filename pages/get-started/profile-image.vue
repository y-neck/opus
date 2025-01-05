<template>
  <main>
    <section class="flex flex-row justify-center items-center h-screen">
      <ProfilePicture />
      <UploadProfilePicture label="Upload Image" />
    </section>
  </main>
</template>

<script setup>
import ProfilePicture from "~/components/user/ProfilePicture.vue";
import UploadProfilePicture from "~/components/user/UploadProfilePicture.vue";

definePageMeta({
  layout: false,
  middleware: "auth",
});

useSeoMeta({
  title: "Opus · Get Started",
  ogTitle: "Get Started",
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
