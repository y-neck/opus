<template>
  <div class="flex flex-col w-full">
    <Header pageTitle="Index" pageIcon="LayoutGridIcon" />
    <main class="p-16">
      <p>Coming soon</p>
    </main>
  </div>
</template>

<script setup>
import Header from "~/components/Header.vue";

// Page meta
definePageMeta({
  title: "Timeline",
  description: "",
  middleware: "auth",
  layout: "default",
});
useSeoMeta({
  title: "Opus - Timeline",
  ogTitle: "Timeline" /* Title of page without branding */,
  ogSiteName: "opus" /* Overall site name */,
  ogType: "website" /* 'website' | 'article' | 'book' | 'profile' */,
  description:
    "Get an overview of all tasks in all your projects, displayed in a timeline",
  ogDescription:
    "Get an overview of all tasks in all your projects, displayed in a timeline",
  creator:
    "https://github.com/y-neck/ | https://github.com/kevinschaerer/" /* Creator of page */,
  robots: "noindex, nofollow" /* Robots meta tag */,
  ogImage: "" /* Image of page when sharing */,
});
</script>

<style scoped></style>
