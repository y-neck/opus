<!-- Register Form -->
<template>
  <form
    class="flex items-center justify-center h-screen mt-[-4rem]"
    @submit.prevent="handleRegister"
  >
    <div class="flex flex-col">
      <h2 class="text-[24px] mb-6 text-grey-700">Create your account</h2>
      <div class="flex flex-col justify-center gap-2">
        <AuthInput type="text" placeholder="Surname" v-model="surname" />
        <AuthInput type="text" placeholder="Name" v-model="name" />
        <AuthInput type="email" placeholder="your@email.com" v-model="email" />
        <AuthInput type="password" placeholder="Password" v-model="password" />
      </div>
      <div class="flex flex-col justify-center">
        <AuthButton
          :disabled="!surname || !name || !email || !password || loading"
          :title="loading ? 'Registering...' : 'Register'"
        />
      </div>
      <transition name="fade">
        <p
          v-if="errorMessage"
          class="absolute top-1/2 mt-14 left-1/2 transform -translate-x-1/2 text-sm text-destructive-red text-center"
          v-html="errorMessage"
        ></p>
        <p
          v-else-if="successMessage"
          class="absolute top-1/2 mt-16 left-1/2 transform -translate-x-1/2 text-sm text-grey-500 text-center"
        >
          Please check your inbox and confirm your email.
        </p>
      </transition>
      <div class="text-center mt-12 text-sm text-grey-500">
        <NuxtLink to="/login">
          <p class="hover:text-grey-700 transition">Already signed-up?</p>
        </NuxtLink>
      </div>
    </div>
  </form>
</template>

<!-- Supabase Register Process -->
<script setup>
const supabase = useSupabaseClient();

const loading = ref(false);
const surname = ref("");
const name = ref("");
const email = ref("");
const password = ref("");

const successMessage = ref(false);
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

    successMessage.value = true;

    setTimeout(() => {
      successMessage.value = false;
    }, 3000);

    // Clear input fields
    surname.value = "";
    name.value = "";
    email.value = "";
    password.value = "";
  } catch (error) {
    console.log(error.status);
    console.log(error.code);

    // Handle error codes
    if (error.status === 422) {
      errorMessage.value = `Your password must be at least 8 characters and contain at least <br /> one number and have a mixture of uppercase and lowercase letters.`;
    } else if (error.code === 409) {
      errorMessage.value = "This email is already registered.";
    } else if (error.status === 429) {
      errorMessage.value = "Too many attempts. Please try again later.";
    } else if (error.status === 500 || undefined) {
      errorMessage.value = "An unexpected error occurred. Please try again.";
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
.btn-outline {
  outline: 1px solid #f4f4f5;
}

input::-webkit-credentials-auto-fill-button {
  margin-left: 20px;
}

/* Transition classes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
