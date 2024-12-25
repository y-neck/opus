<template>
  <div class="flex flex-col w-full">
    <Header pageTitle="Index" pageIcon="LayoutGridIcon" />
    <main class="p-16">
      <p>Hello world</p>
    </main>
  </div>
</template>

<script setup>
import Header from '~/components/Header.vue';

//Page meta
// Page meta
definePageMeta({
  title: 'Home',
  description: '',
  middleware: 'auth',
  layout: 'default',
});
useSeoMeta({
  title: 'Opus - Home',
  ogTitle: 'Home' /* Title of page without branding */,
  ogSiteName: 'opus' /* Overall site name */,
  ogType: 'website' /* 'website' | 'article' | 'book' | 'profile' */,
  description:
    'Welcome to Opus – your project management solution for team projects!',
  ogDescription:
    'Welcome to Opus – your project management solution for team projects!',
  creator: 'https://github.com/y-neck/ | https://github.com/kevinschaerer/' /* Creator of page */,
  robots: 'noindex, nofollow' /* Robots meta tag */,
  ogImage:
    '' /* Image of page when sharing */,
});
</script>

<style scoped></style>
