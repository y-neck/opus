<template>
  <div class="flex flex-col w-full">
    <Header page-title="Task Overview" page-icon="NotepadIcon" />
    <OverviewList />
  </div>
</template>

<script setup>
import Header from "~/components/layout/Header.vue";
import OverviewList from "~/components/project/overview/OverviewList.vue";

definePageMeta({
  middleware: "auth",
  layout: "default",
});

useSeoMeta({
  title: "Opus · Task Overview",
  ogTitle: "Task Overview",
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
