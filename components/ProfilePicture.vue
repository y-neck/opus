<template>
  <div>
    <NuxtImg
      id="profile-img"
      :src="src"
      class="rounded-full bg-grey-100"
      width="64"
      height="64"
      :placeholder="[64, 64]"
      fit="cover"
      alt="Profile Picture"
      loading="lazy"
    />
  </div>
</template>

<script setup lang="ts">
import { supabaseConnection } from '~/composables/supabaseConnection';
import { onMounted } from 'vue';
let user = supabaseConnection().user.value;

const src = ref<string>('');

// Fetch the profile picture URL when the component mounts
onMounted(async () => {
  if (user) {
    // List all files in the user's folder
    const { data: files, error } = await supabaseConnection()
      .supabase.storage.from('profile_img')
      .list(user.id); // Directly using `user.id`

    if (error) {
      console.error('Error listing files:', error);
      src.value = '~/assets/default-profile.jpg';
      return;
    }

    if (files && files.length > 0) {
      // Choose the first file found (or apply additional logic if needed)
      const profileImageFilename = files[0].name;

      // Fetch the public URL of the selected file
      const { data: fileUrl } = supabaseConnection()
        .supabase.storage.from('profile_img')
        .getPublicUrl(`${user.id}/${profileImageFilename}`);

      src.value = fileUrl?.publicUrl || '~/assets/default-profile.jpg';
    } else {
      // Set default image if no files are found
      src.value = '~/assets/default-profile.jpg';
    }
  }
});
</script>
