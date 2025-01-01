<!-- Register Form -->
<template>
  <form
    class="flex items-center justify-center h-screen mt-[-4rem]"
    @submit.prevent="handleRegister"
  >
    <div class="flex flex-col">
      <h2 class="text-[24px] mb-6 text-grey-700">Create your account</h2>
      <div class="flex flex-col justify-center gap-2">
        <AuthInput type="text" placeholder="Name" v-model="name" />
        <AuthInput type="text" placeholder="Surname" v-model="surname" />
        <AuthInput type="email" placeholder="your@email.com" v-model="email" />
        <AuthInput type="password" placeholder="Password" v-model="password" />
      </div>
      <div class="flex flex-col justify-center">
        <AuthButton
          :loading="loading"
          :disabled="!surname || !name || !email || !password"
          label="Register"
        />
      </div>
      <div class="text-center mt-12 text-sm text-grey-500">
        <NuxtLink to="/login">
          <p class="hover:text-grey-700 transition">Already signed-up?</p>
        </NuxtLink>
      </div>
    </div>
  </form>
  <Toast :message="errorMessage || successMessage" />
</template>

<script setup>
import { useSupabaseConnection } from "~/composables/useSupabaseConnection";
const { supabase } = useSupabaseConnection();

const loading = ref(false);
const name = ref("");
const surname = ref("");
const email = ref("");
const password = ref("");

const successMessage = ref("");
const errorMessage = ref("");

const handleRegister = async () => {
  try {
    loading.value = true;

    // Sign up the user
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        emailRedirectTo: "http://localhost:3000/confirm",
      },
    });

    if (signUpError) throw signUpError;

    const uuid = data.user?.id;

    // Insert the user data into the Profiles table
    const { error: insertError } = await supabase.from("Profiles").insert({
      email: email.value,
      name: name.value,
      surname: surname.value,
      user_id: uuid,
    });

    if (insertError) throw insertError;

    successMessage.value = "Confirm your email";

    setTimeout(() => {
      successMessage.value = "";
    }, 3000);

    // Clear input fields
    name.value = "";
    surname.value = "";
    email.value = "";
    password.value = "";
  } catch (error) {
    // Handle error codes
    if (error.status === 422) {
      errorMessage.value = `Password too weak`;
    } else if (error.code === "23505") {
      errorMessage.value = "Email already registered";
    } else if (error.status === 429) {
      errorMessage.value = "Too many attempts, try again later";
    } else if (error.status === 500 || undefined) {
      errorMessage.value = "Something went wrong, try again";
    }
    password.value = "";
    setTimeout(() => {
      errorMessage.value = "";
    }, 3000);
  } finally {
    loading.value = false;
  }
};
</script>

<!-- Scoped Styling -->
<style scoped>
input::-webkit-credentials-auto-fill-button {
  margin-left: 20px;
}
</style>
