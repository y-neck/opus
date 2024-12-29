<template>
  <form
    class="flex items-center justify-center h-screen mt-[-4rem]"
    @submit.prevent="updatePassword"
  >
    <div class="flex flex-col">
      <h2 class="text-[24px] mb-6 text-grey-700">Update your password</h2>
      <div class="flex flex-col justify-center mt-2">
        <AuthInput
          label="New Password"
          type="password"
          placeholder="Enter your new password"
          v-model="newPassword"
          aria-label="New Password"
        />
      </div>
      <div class="flex flex-col justify-center">
        <AuthButton
          :loading="loading"
          :disabled="!newPassword || loading"
          label="Update Password"
        />
      </div>
      <Toast :message="errorMessage || successMessage" />
    </div>
  </form>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const supabase = useSupabaseClient();
const router = useRouter();

const loading = ref(false);
const newPassword = ref("");
const successMessage = ref("");
const errorMessage = ref("");

const updatePassword = async () => {
  try {
    loading.value = true;
    successMessage.value = "";
    errorMessage.value = "";

    // Update the user's password
    const { error } = await supabase.auth.updateUser({
      password: newPassword.value,
    });

    if (error) throw error;

    // Success feedback
    successMessage.value = "Password updated successfully";
    newPassword.value = "";

    setTimeout(() => {
      successMessage.value = "";
      router.push("/inbox");
    }, 3000);
  } catch (error) {
    console.error("Password update failed:", error);

    // Error handling
    if (error.status === 400) {
      errorMessage.value = "Password update failed";
    } else if (error.status === 401) {
      errorMessage.value = "Login required to update password";
    } else if (error.status === 403) {
      errorMessage.value = "User not found";
    } else if (error.code === "same_password") {
      errorMessage.value = "Password is unchanged";
    } else if (error.code === "weak_password") {
      errorMessage.value = "Password too weak";
    } else if (error.status === 429) {
      errorMessage.value = "Too many attempts, try again later";
    } else {
      errorMessage.value = "Password update failed";
    }
    newPassword.value = "";
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
