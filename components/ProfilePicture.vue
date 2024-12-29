<template>
  <div>
    <NuxtImg
      id="profile-img"
      :src="ImageSource"
      class="rounded-full bg-grey-100"
      width="96"
      height="96"
      fit="cover"
      alt="Profile Picture"
      loading="lazy"
    />
  </div>
</template>

<script setup>
import { onMounted } from "vue";

let user = supabaseConnection().user.value;
const ImageSource = ref("");

// Fetch the profile picture URL when the component mounts
onMounted(async () => {
  if (user) {
    // List all files in the user's folder
    const { data, error } = await supabaseConnection()
      .supabase.from("Profiles")
      .select("profile_img, user_id")
      .eq("user_id", user.id);

    ImageSource.value = `https://zdrhwehycbxujrbltjlj.supabase.co/storage/v1/object/public/profile_img/${
      user.id
    }/${data[0].profile_img}?v=${Date.now()}`;
  }
});
</script>
