<template>
  <main>
    <section class="flex flex-row justify-center items-center h-screen">
      <ProfilePicture />
      <UploadProfilePicture label="Upload Image" />
    </section>
  </main>
</template>

<script setup>
definePageMeta({
  title: "Profile Image",
  description: "",
  layout: false,
});
</script>
