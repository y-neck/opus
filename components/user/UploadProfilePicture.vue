<template>
  <div class="ml-3">
    <button id="update-img-button" class="cursor-pointer">
      <label
        for="update-img-input"
        class="flex flex-row items-center gap-1 px-3 h-9 rounded-lg bg-grey-100 hover:bg-grey-200 text-grey-700 transition cursor-pointer"
      >
        <PencilIcon />
        <p id="update-img-button" class="profile-button-text">
          {{ label }}
        </p>
      </label>
      <input
        type="file"
        id="update-img-input"
        accept="image/png, image/jpeg, image/jpg, image/webp, image/svg"
        class="hidden"
        @change="handleFileUpload"
      />
    </button>
  </div>
</template>

<script setup>
// Supabase Connection
const { supabase, user } = useSupabaseConnection();

import { ref } from "vue";

defineProps({
  label: String,
});

const profileImageUrl = ref("");
const loading = ref(false);

const handleFileUpload = async (event) => {
  const input = event.target;
  const file = input?.files?.[0];
  if (!file) return;

  // Validate file type and size
  const validTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
    "image/svg",
  ];
  if (!validTypes.includes(file.type)) {
    alert("Please select a valid image type");
    return;
  }
  if (file.size > 1024 * 1024) {
    alert("File size should be less than 1MB");
    return;
  }

  try {
    loading.value = true;

    if (!user?.id) {
      throw new Error("No authenticated user");
    }

    const { data: profile, error: getError } = await supabase
      .from("Profiles")
      .select("name")
      .eq("user_id", user.id);

    if (getError) throw getError;

    if (!profile || profile.length === 0) {
      throw new Error("Profile not found");
    }

    const username = profile[0].name.toLowerCase();
    const fileExt = file.name.split(".").pop();
    const fileName = `${username}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    // Upload file to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from("profile_img")
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    // Update user's profile with new image URL
    const { error: updateError } = await supabase
      .from("Profiles")
      .update({ profile_img: fileName })
      .eq("user_id", user.id);

    if (updateError) throw updateError;

    // Update local state with new image
    profileImageUrl.value = fileName;
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    alert(`Failed to upload image: ${error.message}`);
  } finally {
    loading.value = false;
  }
};
</script>
