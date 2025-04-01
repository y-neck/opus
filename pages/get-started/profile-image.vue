<template>
  <main>
    <section class="flex flex-col justify-center items-center h-screen">
      <div class="text-left">
        <h2 class="text-2xl text-grey-700 mb-5">Email Confirmed</h2>
        <div class="flex items-end">
          <ProfilePicture />
          <UploadProfilePicture label="Upload Image" />
        </div>
        <div class="mt-5">
          <p class="font-normal text-grey-500 text-sm w-[380px]">
            Please dimensions of at least 200x200 pixels and a maximum size of
            1MB. You can update your picture anytime in your account settings.
          </p>
        </div>
        <div class="mt-10">
          <NuxtLink
            to="/task-overview"
            class="flex flex-row items-center justify-center px-3 h-9 rounded-lg bg-grey-700 hover:bg-grey-800 text-grey-50 transition cursor-pointer w-[380px]"
          >
            Enter Profile
          </NuxtLink>
        </div>
      </div>
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
