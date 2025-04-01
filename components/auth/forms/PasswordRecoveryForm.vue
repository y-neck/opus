<template>
  <form
    class="flex items-center flex-col justify-center h-screen mt-[-4rem]"
    @submit.prevent="recoverPassword"
  >
    <div class="flex flex-col">
      <h2 class="text-[24px] mb-6 text-grey-700">Reset your password</h2>
      <div class="flex flex-col justify-center">
        <AuthInput
          label="Email"
          type="email"
          placeholder="your@email.com"
          v-model="email"
        />
      </div>
      <div class="flex flex-col justify-center">
        <AuthButton
          :loading="loading"
          :disabled="!email"
          label="Send recovery link"
        />
      </div>
    </div>
    <div class="text-center mt-12 text-sm text-grey-500">
      <NuxtLink to="/login">
        <p class="hover:text-grey-700 transition">Go back to login</p>
      </NuxtLink>
    </div>
  </form>
  <Toast :message="errorMessage || successMessage" />
</template>

<script setup>
// Supabase Connection
import { useSupabaseConnection } from "~/composables/useSupabaseConnection";
const { supabase } = useSupabaseConnection();

import Toast from "~/components/common/Toast.vue";

// References
const loading = ref(false);
const successMessage = ref("");
const email = ref("");
const errorMessage = ref("");

const recoverPassword = async () => {
  try {
    loading.value = true;
    successMessage.value = "";
    errorMessage.value = "";

    // Check if email exists in db
    const { data: emails, error: queryError } = await supabase
      .from("Profiles")
      .select("email")
      .eq("email", email.value)
      .single();

    console.log(emails);

    // If email not found
    if (emails === null) {
      errorMessage.value = "Email not found";
      email.value = "";
      setTimeout(() => {
        errorMessage.value = "";
      }, 3000);
      return;
    }
    // If email found
    const { error } = await supabase.auth.resetPasswordForEmail(email.value, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) throw error;

    successMessage.value = "Recovery link sent";
    email.value = "";
    setTimeout(() => {
      successMessage.value = "";
    }, 3000);
  } catch (error) {
    console.log(error.status, error.message);

    if (error.status === 429) {
      errorMessage.value = "Too many attempts, try again later";
    } else {
      errorMessage.value = "Something went wrong, try again";
    }

    email.value = "";

    setTimeout(() => {
      errorMessage.value = "";
    }, 3000);
  } finally {
    loading.value = false;
  }
};
</script>
