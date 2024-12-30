<template>
  <div
    class="w-[41rem] h-[17.25rem] border border-grey-100 absolute bg-white px-8 py-6 right-6 mt-12 rounded-lg"
    :isOpen="isOpen"
    @close="closeModal"
  >
    <h2 class="text-2xl font-semibold">Invite a new member</h2>

    <form @submit.prevent="handleInvite">
      <div class="pt-6">
        <label class="block text-sm font-medium mb-1 text-grey-500"
          >Email</label
        >
        <input
          v-model="email"
          type="email"
          required
          class="w-[24.75rem] pl-3 h-9 border border-grey-100 rounded-lg placeholder:font-base"
          placeholder="Add a new member by mail"
        />
      </div>
    </form>

    <div class="flex justify-end gap-2 bottom-6 right-6 absolute">
      <button @click="closeModal" class="px-4 py-2 text-grey-500 rounded-lg">
        Cancel
      </button>
      <button
        @click="handleInvite"
        :disabled="isLoading"
        class="px-4 py-2 bg-grey-700 text-grey-50 rounded-lg disabled:opacity-50"
      >
        {{ isLoading ? "Sending..." : "Invite" }}
      </button>
    </div>
  </div>
</template>

<script setup>
const { supabase } = supabaseConnection();
import { ref } from "vue";

const emit = defineEmits(["close"]);

const props = defineProps({
  isOpen: Boolean,
  projectId: String,
});

const email = ref("");
const role = ref("3");
const isLoading = ref(false);

const closeModal = () => {
  email.value = "";
  role.value = "3";
  emit("close");
};

const generateInvitationToken = () => {
  return Array.from({ length: 32 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("");
};

const invitationToken = generateInvitationToken();

const handleInvite = async () => {
  try {
    isLoading.value = true;

    const { data: project, error: projectError } = await supabase
      .from("Projects")
      .select("project_name")
      .eq("id", props.projectId);

    if (projectError) {
      throw new Error("Failed to fetch project data");
    }

    if (!project || project.length === 0) {
      throw new Error("Project not found");
    }

    const projectName = project[0].project_name;

    console.log(projectName);

    if (projectError) {
      console.error("Error fetching project:", projectError);
    } else if (!project) {
      console.warn("No project found for ID:", props.projectId);
    } else {
      console.log("Project data:", project);
    }

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
          projectName: projectName,
          invitationToken: invitationToken,
        }),
      }
    );

    console.log(projectName);

    const responseData = await response.json();
    if (!response.ok || responseData.error) {
      throw new Error(
        `Failed to send invitation: ${responseData.error || "Unknown error"}`
      );
    }

    await supabase
      .from("Invitations")
      .insert([
        {
          project_id: props.projectId,
          email: email.value,
          role: role.value,
          token: invitationToken,
          status: "pending",
          expires_at: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
      ])
      .select()
      .single();

    closeModal();
  } catch (error) {
    console.error("Error sending invitation:", error);
  } finally {
    isLoading.value = false;
  }
};
</script>
