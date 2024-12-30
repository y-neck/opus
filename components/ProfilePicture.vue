<template>
  <div v-if="isLoading">
    <ProfileImageSkeleton />
  </div>
  <div v-else>
    <NuxtImg
      preload
      id="profile-img"
      :src="ImageSource"
      class="rounded-full"
      width="96"
      height="96"
      fit="cover"
      alt="Profile Picture"
      loading="lazy"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import ProfileImageSkeleton from "./Skeleton/ProfileImageSkeleton.vue";

const ImageSource = ref("");
const isLoading = ref(true);

let user = supabaseConnection().user.value;

// Fetch the profile picture and preload the image
onMounted(async () => {
  if (user) {
    const { data, error } = await supabaseConnection()
      .supabase.from("Profiles")
      .select("profile_img, user_id")
      .eq("user_id", user.id);

    if (data && data[0]) {
      const imageUrl = `https://zdrhwehycbxujrbltjlj.supabase.co/storage/v1/object/public/profile_img/${
        user.id
      }/${data[0].profile_img}?v=${Date.now()}`;

      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        ImageSource.value = imageUrl;
        isLoading.value = false;
      };
    } else {
      isLoading.value = false;
    }
  }
});
</script>
