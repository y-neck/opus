<template>
  <div class="flex flex-col w-full">
    <Header pageTitle="Index" pageIcon="LayoutGridIcon" />
    <main class="p-16">
      <p>Hello world</p>
    </main>
  </div>
</template>

<script setup>
import Header from "~/components/layout/Header.vue";

definePageMeta({
  layout: false,
});

useSeoMeta({
  title: "Opus · Home",
  ogTitle: "Home",
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
