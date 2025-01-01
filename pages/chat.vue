<template>
  <div class="flex flex-col w-full">
    <Header pageTitle="Chat" pageIcon="BubbleIcon" />
    <main class="p-16">
      <p>Coming soon</p>
    </main>
  </div>
</template>

<script setup lang="ts">
import Header from "~/components/layout/Header.vue";

useSeoMeta({
  title: "" /* Page title */,
  ogTitle: "" /* Page title without branding */,
  ogSiteName: "" /* Overall site name */,
  ogType: "website" /* 'website' | 'article' | 'book' | 'profile' */,
  description: "",
  ogDescription: "",
  creator: "",
  robots: "" /* 'index' | 'follow' | 'noindex' | 'nofollow' */,
  ogImage: "" /* Image for sharing */,
});
</script>

<style scoped></style>
