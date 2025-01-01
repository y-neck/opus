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
  title: "Profile Image",
  description: "",
  layout: false,
});
</script>
