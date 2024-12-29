<template>
  <section class="flex flex-col justify-center items-center h-screen">
    <div class="max-w-[30rem] text-left">
      <h1
        v-if="userSurname"
        class="text-[24px] mb-2 text-grey-700"
        v-html="userSurname"
      ></h1>
      <p class="text-grey-700 mb-8">
        Welcome to Opus! We’re excited to have you on board. <br />
        Get ready to explore and enjoy all the features we have for you. Let’s
        get started!
      </p>
      <NuxtLink
        class="py-2 px-3 bg-grey-700 active:hover:bg-grey-800 text-grey-50 rounded-lg font-regular transition disabled:opacity-80 disabled:transition font-medium"
        to="/welcome/profile-image"
      >
        Continue
      </NuxtLink>
    </div>
  </section>
</template>

<script setup>
import { supabaseConnection } from "~/composables/supabaseConnection";
const { supabase, user } = supabaseConnection();

const userSurname = ref("");

// Fetch the user's surname from the Profiles table
const { data: profileData, error } = await supabase
  .from("Profiles")
  .select("surname")
  .eq("user_id", user?.id)
  .single();

if (profileData) {
  userSurname.value = `Hey ${profileData.surname}!`;
} else {
  userSurname.value = "Hey there!";
}

// Page meta
definePageMeta({
  title: "Documents",
  description: "",
  layout: "false",
  middleware: "auth",
});
</script>
