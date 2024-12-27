<template>
  <div :isOpen="isOpen" @close="closeModal">
    <h2 class="text-xl font-semibold">Invite Team Member</h2>

    <form @submit.prevent="handleInvite" class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-1">Email Address</label>
        <input
          v-model="email"
          type="email"
          required
          class="w-full p-2 border rounded-md"
          placeholder="colleague@company.com"
        />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Role</label>
        <select v-model="role" class="w-full p-2 border rounded-md">
          <option value="3">Member</option>
          <option value="2">Admin</option>
        </select>
      </div>
    </form>

    <div class="flex justify-end gap-2">
      <button
        @click="closeModal"
        class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
      >
        Cancel
      </button>
      <button
        @click="handleInvite"
        :disabled="isLoading"
        class="px-4 py-2 bg-primary text-black rounded-md disabled:opacity-50"
      >
        {{ isLoading ? "Sending..." : "Send Invitation" }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  isOpen: Boolean,
  projectId: String,
});

const emit = defineEmits(["close"]);

const email = ref("");
const role = ref("3");
const isLoading = ref(false);

const closeModal = () => {
  email.value = "";
  role.value = "3";
  emit("close");
};

const handleInvite = async () => {
  try {
    isLoading.value = true;

    const SUPABASE_KEY = process.env.SUPABASE_KEY;

    const response = await fetch(
      "https://zdrhwehycbxujrbltjlj.supabase.co/functions/v1/resend",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        body: JSON.stringify({
          email: email.value,
          role: role.value,
          projectId: props.projectId,
        }),
      }
    );

    const responseData = await response.json();
    if (!response.ok || responseData.error) {
      throw new Error(
        `Failed to send invitation: ${responseData.error || "Unknown error"}`
      );
    }

    closeModal();
  } catch (error) {
    console.error("Error sending invitation:", error);
  } finally {
    isLoading.value = false;
  }
};
</script>
