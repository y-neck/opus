<template>
  <div class="flex flex-col w-full">
    <Header page-title="Settings" page-icon="SettingsIcon" />
    <main class="p-16">
      <h2 id="update-profile " class="pb-8 text-grey-700 text-2xl">
        Update Profile
      </h2>
      <div
        id="profile-img-section"
        class="flex items-end border-b-2 border-b-grey-100 w-full md:w-1/2 pb-16"
      >
        <ProfilePicture src="~/public/img/dev-icon-testing.png" />
        <button
          class="profile-button bg-grey-100 hover:bg-grey-200 text-grey-700 transition mx-3"
        >
          <PencilIcon />
          <p id="update-img-button" class="profile-button-text">Update</p>
        </button>
      </div>
      <div
        id="profile-information-container"
        class="w-full border-b-2 border-b-grey-100 pb-6"
      >
        <form
          id="profile-information"
          class="flex flex-col gap-4 pt-8"
          method="post"
        >
          <div class="input-container">
            <label for="name-field" id="name-label" class="input-label"
              >Name</label
            >
            <input
              type="text"
              v-model="name"
              id="name-field"
              class="input-text"
              :placeholder="`Your name: ${currentName}`"
              :aria-placeholder="`Your name: ${currentName}`"
              aria-labelledby="name-label"
            /><!-- TODO: Replace with current user name -->
          </div>
          <div class="input-container">
            <label for="surname-field" id="surname-label" class="input-label"
              >Surname</label
            >
            <input
              type="text"
              v-model="surname"
              id="surname-field"
              class="input-text"
              :placeholder="`Your surname: ${currentSurname}`"
              :aria-placeholder="`Your surname: ${currentSurname}`"
              aria-labelledby="surname-label"
            />
          </div>
          <div class="input-container">
            <label for="email-field" id="email-label" class="input-label"
              >Email</label
            >
            <input
              type="email"
              v-model="email"
              class="input-text"
              id="email-field"
              :placeholder="`Your current email: ${currentEmail}`"
              :aria-placeholder="`Your current email: ${currentEmail}`"
              aria-labelledby="email-label"
            /><!-- TODO: Replace with current user email -->
          </div>

          <button
            id="update-profile-button"
            class="profile-button bg-grey-100 hover:bg-grey-200 text-grey-700 transition"
          >
            Save Changes
          </button>
        </form>
      </div>
      <div id="deleteAccount" class="w-full flex flex-col gap-4 pt-6">
        <h2 class="text-2xl">Delete Account</h2>
        <p class="w-1/2 text-grey-500">
          Keep in mind that this action is irreversible and all your data will
          be permanently deleted. If you have any concerns or feedback, we'd
          love to hear from you before you go.
        </p>
        <button
          id="delete-account-btn"
          class="profile-button text-white bg-destructive-red hover:bg-destructive-darkRed transition"
          @click="showDeleteModal()"
        >
          Delete Account
        </button>
      </div>
      <Modal
        v-if="isDeleteModalOpen"
        :isOpen="isDeleteModalOpen"
        title="Delete Account"
        message="Are you sure you want to delete your account? This action cannot be undone."
        @confirm="deleteAccount()"
        @cancel="isDeleteModalOpen = false"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { supabaseConnection } from '~/composables/supabaseConnection';
import Header from '~/components/Header.vue';
import PencilIcon from '~/components/icons/PencilIcon.vue';
import ProfilePicture from '~/components/ProfilePicture.vue';
import Modal from '~/components/Modals/RemoveModal.vue';

// Form input bindings for user profile updates
let name: string = '';
let surname: string = '';
let email: string = '';

/* DB CRUD */
// read
let userId = supabaseConnection().user.value?.id;
let currentName: string;
let currentSurname: string;
let currentEmail: string = supabaseConnection().user.value?.email;

// TODO:Fetch user's profile picture from DB

// Fetch user name from DB
const { data: fetchName, error: fetchNameError } = await supabaseConnection()
  .supabase.from('Profiles')
  .select('name')
  .eq('user_id', userId);
if (fetchName && fetchName !== null) {
  currentName = fetchName[0].name;
} else {
  currentName = '';
  console.error(fetchNameError);
}
// Fetch user surname from DB
const { data: fetchSurname, error: fetchSurnameError } =
  await supabaseConnection()
    .supabase.from('Profiles')
    .select('surname')
    .eq('user_id', userId);
if (fetchSurname && fetchSurname !== null) {
  currentSurname = fetchSurname[0].surname;
} else {
  currentSurname = '';
  console.error(fetchSurnameError);
}

// update

// delete
function deleteAccount() {
  alert(
    'Do you really want to delete your account? You will lose all your data! This action cannot be undone.'
  );
  //TODO: DB connection
  console.log('Account deleted');
}

/* Handle Modals */
const isDeleteModalOpen = ref(false);
function showDeleteModal() {
  isDeleteModalOpen.value = true;
}

// Page meta
definePageMeta({
  title: 'Settings',
  description: '',
  middleware: 'auth',
  layout: 'default',
});
</script>

<style scoped>
.input-container {
  @apply flex;
  @apply flex-col;
}

.input-label {
  @apply text-grey-500;
  @apply text-sm;
}

.input-text {
  @apply text-grey-700;
  @apply placeholder:text-grey-500;
  @apply border-2;
  @apply border-grey-100;
  @apply rounded-lg;
  @apply px-3;
  @apply py-2;
}

.profile-button {
  @apply flex;
  @apply px-3;
  @apply py-2;
  @apply rounded-lg;
  @apply h-fit;
  @apply w-fit;
  @apply items-center;
  @apply gap-1;
}
</style>
