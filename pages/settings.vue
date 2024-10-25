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
        <ProfilePicture src="" alt="Profile Img" />
        <button id="update-img-button">
          <label
            for="update-img-input"
            class="profile-button bg-grey-100 hover:bg-grey-200 text-grey-700 transition mx-3"
          >
            <PencilIcon />
            <p id="update-img-button" class="profile-button-text">Update</p>
          </label>
          <input
            type="file"
            id="update-img-input"
            accept="image/png, image/jpeg, image/jpg, image/webp, image/svg"
            class="hidden"
          />
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
              v-model="newSetName"
              id="name-field"
              class="input-text"
              :placeholder="`Your name: ${currentName}`"
              :aria-placeholder="`Your name: ${currentName}`"
              aria-labelledby="name-label"
            />
          </div>
          <div class="input-container">
            <label for="surname-field" id="surname-label" class="input-label"
              >Surname</label
            >
            <input
              type="text"
              v-model="newSetSurname"
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
              v-model="newSetEmail"
              class="input-text"
              id="email-field"
              :placeholder="`Your current email: ${currentEmail}`"
              :aria-placeholder="`Your current email: ${currentEmail}`"
              aria-labelledby="email-label"
            />
          </div>

          <button
            id="update-profile-button"
            class="profile-button bg-grey-100 hover:bg-grey-200 text-grey-700 transition"
            @click="updateUserProfile(newSetEmail, newSetName, newSetSurname)"
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
let newSetName: string = '';
let newSetSurname: string = '';
let newSetEmail: string = '';

/* DB CRUD */
// read
let userId = supabaseConnection().user.value?.id;
let currentName: string;
let currentSurname: string;
let currentEmail: any = supabaseConnection().user.value?.email;
// Fetch user name from DB
if (userId) {
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
}

// Fetch user surname from DB
if (userId) {
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
}

// update
let updateImgInput: any = document?.querySelector('#update-img-input');
let profileImgHolder = document?.querySelector('#profile-img');
updateImgInput?.addEventListener('change', updateProfileImg);

// Update profile picture
async function updateProfileImg(event: Event) {
  const selectedProfileImg = (event.target as HTMLInputElement).files?.[0];
  if (selectedProfileImg) {
    // Error if >200kb
    if (selectedProfileImg.size > 200000) {
      alert('File size should not exceed 200kb');
      return;
    }
    // Replace spaces in filename with _
    let selectedProfileImgRegexed = selectedProfileImg.name.replace(
      /\s+/g /* Replace white space with _ */,
      '_'
    );
    // Store file to user bucket if provided
    const { data, error } = await supabaseConnection()
      .supabase.storage.from('profile_img')
      .upload(
        supabaseConnection().user.value?.id + '/' + selectedProfileImgRegexed,
        selectedProfileImg,
        {
          // Replace existing file
          upsert: true,
        }
      );
    // Update profile picture on settings page
    const { data: getProfileImgUrl } = await supabaseConnection()
      .supabase.storage.from('profile_img') /* Get file from bucket */
      .getPublicUrl(
        supabaseConnection().user.value?.id + '/' + selectedProfileImgRegexed
      );
    /* Replace profile picture */
    profileImgHolder?.setAttribute('src', getProfileImgUrl?.publicUrl);
  }
}

// Update user profile
async function updateUserProfile(
  newSetEmail: string,
  newSetName: string,
  newSetSurname: string
) {
  // Update profile in the 'Profiles' table if there are changes in name or surname
  if (currentName !== newSetName || currentSurname !== newSetSurname) {
    const { data: profileData, error: profileError } =
      await supabaseConnection()
        .supabase.from('Profiles')
        .update({
          name: currentName !== newSetName ? newSetName : currentName,
          surname:
            currentSurname !== newSetSurname ? newSetSurname : currentSurname,
        })
        .eq('email', currentEmail);

    if (profileError) {
      console.error('Error updating profile:', profileError);
      return;
    }
    console.log('Profile updated successfully:', profileData);
  }

  // Update user's email in Supabase Auth if the email has changed
  if (currentEmail !== newSetEmail) {
    const { data: authEmail, error: authEmailError } =
      await supabaseConnection().supabase.auth.updateUser({
        email: newSetEmail,
      });

    if (authEmailError) {
      console.error('Error updating user email in auth:', authEmailError);
      return;
    }
    console.log('User email updated successfully:', authEmail);
  }
}

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
