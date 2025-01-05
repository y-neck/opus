<template>
  <div class="flex min-h-screen items-center justify-center">
    <div class="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
      <!-- Loading State -->
      <div v-if="pending" class="text-center">
        <p>Verifying invitation...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="hasError" class="text-center">
        <div class="text-red-600 mb-4">
          <p class="font-bold mb-2">{{ errorMessage }}</p>
          <p v-if="errorDetails" class="text-sm mt-2">
            {{ errorDetails }}
          </p>
        </div>

        <div class="space-y-3 mt-4">
          <NuxtLink
            v-if="needsAuth"
            to="/login"
            class="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Log In to Accept Invitation
          </NuxtLink>

          <NuxtLink
            v-else
            to="/"
            class="inline-block bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Return Home
          </NuxtLink>
        </div>
      </div>

      <!-- Success State -->
      <div v-else class="text-center text-green-600">
        <h2 class="text-2xl font-bold mb-4">Invitation Accepted!</h2>
        <p class="mb-4">You have successfully joined the project.</p>
        <NuxtLink
          :to="`/projects/${projectId}`"
          class="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Go to Project
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
// Supabase Connection
const { user } = useSupabaseConnection();

import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const token = route.query.token;

// Reactive variables
const pending = ref(true);
const hasError = ref(false);
const errorMessage = ref("");
const errorDetails = ref("");
const projectId = ref(null);
const needsAuth = ref(false);

onMounted(async () => {
  // If the user is not authenticated, show an error
  if (!user) {
    hasError.value = true;
    errorMessage.value = "You need to be logged in to accept this invitation";
    needsAuth.value = true;
    pending.value = false;
    return;
  }

  if (!token) {
    hasError.value = true;
    errorMessage.value = "Invalid invitation link";
    pending.value = false;
    return;
  }

  try {
    const response = await $fetch("/api/verify-invitation", {
      method: "POST",
      body: { token },
      headers: { "Content-Type": "application/json" },
    });

    // Handle success
    console.log("Success:", response);
  } catch (err) {
    console.error("Error during verification:", err);
    hasError.value = true;
    errorMessage.value = err.message || "An unexpected error occurred.";
  } finally {
    pending.value = false;
  }
});

useSeoMeta({
  title: "Opus · Invitation",
  ogTitle: "Invitation",
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
