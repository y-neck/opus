<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <div class="text-left">
      <h2 class="text-2xl text-grey-700">{{ userSurname }}</h2>
      <p class="text-grey-500 font-normal pt-0.5 mb-5 max-w-1/3">
        Welcome to Opus! We’re excited to have you on board. <br />
        Get ready to explore and enjoy all the features we have for you.
        <br />Let’s get started!
      </p>
      <NuxtLink
        class="py-2 px-3 bg-grey-700 active:hover:bg-grey-800 text-grey-50 rounded-lg"
        to="/get-started/profile-image"
      >
        Continue
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
// Supabase Connection
const { supabase, user } = useSupabaseConnection();

const userSurname = ref("");

// Fetch the user's surname from the Profiles table
const { data: profileData, error } = await supabase
  .from("Profiles")
  .select("name")
  .eq("user_id", user.id);

console.log(profileData);

if (profileData) {
  userSurname.value = `Hey ${profileData[0].name}!`;
} else {
  userSurname.value = "Hey there!";
}

// Page meta
definePageMeta({
  layout: "false",
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
