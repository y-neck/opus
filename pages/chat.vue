<template>
  <div class="flex flex-col w-full">
    <Header pageTitle="Index" pageIcon="LayoutGridIcon" />
    <main class="p-16">
      <p>Coming soon</p>
    </main>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: "", /* Page title */
  ogTitle: "", /* Page title without branding */
  ogSiteName: "", /* Overall site name */
  ogType: "", /* 'website' | 'article' | 'book' | 'profile' */
  description: "",
  ogDescription: "",
  creator: "",
  robots: "", /* 'index' | 'follow' | 'noindex' | 'nofollow' */
  ogImage: "" /* Image for sharing */
})

</script>

<style scoped>
</style>