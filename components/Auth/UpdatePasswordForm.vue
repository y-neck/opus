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
          :disabled="!newPassword || loading"
          :title="loading ? 'Updating...' : 'Update Password'"
        />
      </div>
      <transition name="fade">
        <p
          v-if="message"
          class="text-center text-sm mt-4"
          :class="messageClass"
        >
          {{ message }}
        </p>
      </transition>
    </div>
  </form>
</template>

<script setup>
import { ref } from "vue";

const supabase = useSupabaseClient();

const loading = ref(false);
const newPassword = ref("");
const message = ref("");
const messageClass = ref("");

const updatePassword = async () => {
  try {
    loading.value = true;
    message.value = "";
    messageClass.value = "";

    // Update the user's password
    const { error } = await supabase.auth.updateUser({
      password: newPassword.value,
    });

    if (error) throw error;

    // Success feedback
    message.value = "Your password has been updated successfully.";
    messageClass.value = "text-green-500";
    newPassword.value = ""; // Clear the password input
  } catch (error) {
    console.error("Password update failed:", error);

    // Error handling
    if (error.status === 400) {
      message.value =
        "Invalid request. Please ensure your new password is strong.";
    } else if (error.status === 401) {
      message.value = "You must be logged in to update your password.";
    } else if (error.status === 429) {
      message.value = "Too many attempts. Please try again later.";
    } else {
      message.value = "Failed to update password. Please try again.";
    }

    messageClass.value = "text-red-500";
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
