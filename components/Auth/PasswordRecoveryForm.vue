<template>
  <form
    class="flex items-center flex-col justify-center h-screen mt-[-4rem]"
    @submit.prevent="recoverPassword"
  >
    <div class="flex flex-col">
      <h2 class="text-[24px] mb-6 text-grey-700">Reset your password</h2>
      <div class="flex flex-col justify-center mb-1">
        <AuthInput
          label="Email"
          type="email"
          placeholder="your@email.com"
          v-model="email"
          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
        />
      </div>
      <transition name="fade">
        <p
          v-if="errorMessage"
          class="absolute top-1/2 mt-14 left-1/2 transform -translate-x-1/2 text-sm text-destructive-red text-center"
        >
          {{ errorMessage }}
        </p>
        <p
          v-else-if="success"
          class="absolute top-1/2 mt-6 left-1/2 transform -translate-x-1/2 text-sm text-grey-500 text-center"
        >
          Recovery link sent! Check your email.
        </p>
      </transition>
      <div class="flex flex-col justify-center">
        <AuthButton
          :disabled="!email || loading || success"
          :title="
            loading
              ? 'Sending...'
              : success
              ? 'Recovery link sent'
              : 'Send recovery link'
          "
        />
      </div>
    </div>
    <div class="text-center mt-12 text-sm text-grey-500">
      <NuxtLink to="/login">
        <p class="hover:text-grey-700 transition">Go back to login</p>
      </NuxtLink>
    </div>
  </form>
</template>

<script setup>
const supabase = useSupabaseClient();

const loading = ref(false);
const success = ref(false);
const email = ref("");
const errorMessage = ref(""); // State for error messages

const recoverPassword = async () => {
  try {
    loading.value = true;
    success.value = false;
    errorMessage.value = "";

    const { error } = await supabase.auth.resetPasswordForEmail(email.value, {
      redirectTo: "http://localhost:3000/update-password",
    });

    if (error) throw error;

    success.value = true;
    email.value = "";
    setTimeout(() => {
      success.value = false;
    }, 3000);
  } catch (error) {
    console.log(error.status, error.message);

    if (error.status === 400) {
      errorMessage.value = "Invalid email address. Please try again.";
    } else if (error.status === 429) {
      errorMessage.value = "Too many requests. Please try again later.";
    } else {
      errorMessage.value = "An unexpected error occurred. Please try again.";
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

<style scoped>
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
