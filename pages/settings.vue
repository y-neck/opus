<template>
  <div class="w-full">
    <Header page-title="Settings" page-icon="SettingsIcon" />
    <main class="p-16">
      <h2 id="update-profile" class="pb-5 text-grey-700 text-2xl">
        Update Profile
      </h2>
      <div id="profile-img-section" class="flex items-end">
        <ProfilePicture
          :src="profileImage"
          alt="Profile Image"
          id="profile-img"
        />
        <UploadProfilePicture label="Edit" />
      </div>
      <div id="profile-information-container" class="pt-14">
        <form
          id="profile-information"
          class="flex flex-col gap-5 items-start"
          @submit.prevent="updateUserProfile"
        >
          <div class="flex flex-col gap-1">
            <label for="name-field" class="text-grey-500 text-sm">Name</label>
            <input
              type="text"
              v-model="newSetName"
              id="name-field"
              class="border border-grey-100 h-9 w-[396px] placeholder:text-grey-400 pl-3 rounded-lg"
              :placeholder="currentName"
            />
          </div>
          <div class="flex flex-col gap-1">
            <label for="surname-field" class="text-grey-500 text-sm"
              >Surname</label
            >
            <input
              type="text"
              v-model="newSetSurname"
              id="surname-field"
              class="border border-grey-100 h-9 w-[396px] placeholder:text-grey-400 pl-3 rounded-lg"
              :placeholder="currentSurname"
            />
          </div>
          <div class="flex flex-col gap-1">
            <label for="email-field" class="text-grey-500 text-sm">Email</label>
            <input
              type="email"
              v-model="newSetEmail"
              id="email-field"
              class="border border-grey-100 h-9 w-[396px] placeholder:text-grey-400 pl-3 rounded-lg"
              :placeholder="currentEmail"
            />
          </div>
          <button
            type="submit"
            class="flex flex-row items-center gap-1 px-3 h-9 rounded-lg bg-grey-100 hover:bg-grey-200 text-grey-700 transition cursor-pointer"
          >
            Save Changes
          </button>
        </form>
      </div>
      <hr class="border-grey-100 mt-12" />
      <div id="deleteAccount" class="pt-6">
        <h2 class="text-2xl">Delete Account</h2>
        <p class="text-grey-500 font-normal pt-0.5">
          Keep in mind that this action is irreversible and all your data will
          be permanently deleted. <br />
          If you have any concerns or feedback, we'd love to hear from you
          before you go.
        </p>
        <button
          id="delete-account-btn"
          class="flex flex-row items-center px-3 h-9 rounded-lg bg-destructive-red hover:bg-destructive-darkRed text-grey-50 transition cursor-pointer mt-5"
          @click="showDeleteModal"
        >
          Delete Account
        </button>
        <Toast :message="profileUpdated || profileError" />
      </div>
      <RemoveModal
        v-if="isDeleteModalOpen"
        :isOpen="isDeleteModalOpen"
        title="Delete Account"
        message="Are you sure you want to delete your account? This action cannot be undone."
        @confirm="deleteAccount"
        @cancel="isDeleteModalOpen = false"
      />
    </main>
  </div>
</template>

<script setup>
const { supabase, user } = useSupabaseConnection();

import { ref, onMounted } from "vue";
import RemoveModal from "~/components/project/RemoveModal.vue";
import Header from "~/components/layout/Header.vue";
import Toast from "~/components/common/Toast.vue";
import ProfilePicture from "~/components/user/ProfilePicture.vue";
import UploadProfilePicture from "~/components/user/UploadProfilePicture.vue";

// References
const currentName = ref("");
const currentSurname = ref("");
const currentEmail = ref("");
const profileImage = ref("");

const newSetName = ref("");
const newSetSurname = ref("");
const newSetEmail = ref("");

const profileUpdated = ref("");
const profileError = ref("");

// Modal
const isDeleteModalOpen = ref(false);
function showDeleteModal() {
  isDeleteModalOpen.value = true;
}

// Fetch user details
onMounted(async () => {
  if (user) {
    currentEmail.value = user.email;
    const { data, error } = await supabase
      .from("Profiles")
      .select("name, surname")
      .eq("user_id", user.id)
      .single();

    if (data) {
      currentName.value = data.name;
      currentSurname.value = data.surname;
    } else {
      console.error(error);
    }
  }
});

// Update Profile
async function updateUserProfile() {
  profileUpdated.value = "";
  profileError.value = "";

  if (user) {
    try {
      const updates = {
        name: newSetName.value || currentName.value,
        surname: newSetSurname.value || currentSurname.value,
      };
      const { error } = await supabase
        .from("Profiles")
        .update(updates)
        .eq("user_id", user.id);

      if (newSetEmail.value && newSetEmail.value !== currentEmail.value) {
        const { error: authError } = await supabase.auth.updateUser({
          email: newSetEmail.value,
          options: {
            emailRedirectTo: `${window.location.origin}/settings`,
          },
        });
        if (authError) throw authError;
      }

      currentName.value = updates.name;
      currentSurname.value = updates.surname;

      // Change Message for Toast
      profileUpdated.value = "Profile updated";

      newSetName.value = "";
      newSetSurname.value = "";
      newSetEmail.value = "";

      setTimeout(() => {
        profileUpdated.value = "";
      }, 3000);
    } catch (err) {
      console.error("Error updating profile:", err);

      // Change Message for Toast
      profileError.value = "Error updating profile";

      setTimeout(() => {
        profileError.value = "";
      }, 3000);
    }
  }
}

// Delete Account
async function deleteAccount() {
  if (user) {
    const { error } = await supabase.auth.admin.deleteUser(user.id);
    if (!error) {
      navigateTo("/login");
    } else {
      console.error(error);
    }
  }
}

// Page meta
definePageMeta({
  middleware: "auth",
  layout: "default",
});

useSeoMeta({
  title: "Opus · Settings",
  ogTitle: "Settings",
  ogSiteName: "opus",
  ogType: "website",
  description:
    "Change your profile picture, update your email address, and more!",
  ogDescription:
    "Change your profile picture, update your email address, and more!",
  creator: "https://github.com/y-neck/ | https://github.com/kevinschaerer/",
  robots: "noindex, nofollow",
  ogImage: "",
});
</script>
