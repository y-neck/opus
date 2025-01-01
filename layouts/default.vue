<template>
  <div
    class="bg-white text-grey-700 px-7 min-h-screen w-full md:flex md:flex-row"
  >
    <Navbar />
    <slot />
  </div>
</template>

<script setup>
import Navbar from "~/components/layout/Navbar";
</script>
