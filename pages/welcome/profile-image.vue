<template>
  <section class="flex flex-row justify-center items-center h-screen">
    <div>
      <ProfilePicture :src="profileImageUrl" alt="Profile Img" />
      <button id="update-img-button" class="cursor-pointer">
        <label
          for="update-img-input"
          class="profile-button bg-grey-100 hover:bg-grey-200 text-grey-700 transition mx-3"
        >
          <PencilIcon />
          <p id="update-img-button" class="profile-button-text">
            {{ loading ? "Uploading..." : "Upload Image" }}
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
  </section>
</template>

<script setup>
const loading = ref(false);
const supabase = useSupabaseClient();
const user = useSupabaseUser();

const profileImageUrl = ref("");

const handleFileUpload = async (event) => {
  const file = event.target.files[0];

  if (!file) return;

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

  if (file.size > 5 * 1024 * 1024) {
    alert("File size should be less than 5MB");
    return;
  }

  try {
    loading.value = true;

    // Ensure user exists
    if (!user.value?.id) {
      throw new Error("No user authenticated");
    }

    // First, check bucket exists
    const { data: bucketData, error: bucketError } =
      await supabase.storage.getBucket("profile_img");

    if (bucketError) {
      console.error("Bucket Check Error:", bucketError);
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${user.value.id}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("profile_img")
      .upload(filePath, file, {
        upsert: true,
      });

    if (uploadError) {
      console.error("Storage Upload Error:", uploadError);
      throw uploadError;
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("profile_img").getPublicUrl(filePath);

    // Update profiles table with new image URL
    const { data, error: profileUpdateError } = await supabase
      .from("Profiles")
      .update({ profile_img: publicUrl })
      .eq("user_id", user.value.id)
      .select();

    if (profileUpdateError) {
      console.error("Profile Update Error:", profileUpdateError);
      throw profileUpdateError;
    }

    // Update local state
    profileImageUrl.value = publicUrl;

    alert("Profile picture updated successfully!");
  } catch (error) {
    console.error("Full Error Object:", error);
    alert(`Failed to update profile picture: ${error.message}`);
  } finally {
    loading.value = false;
  }
};

// Fetch current profile image on component mount
onMounted(async () => {
  try {
    const { data, error } = await supabase
      .from("Profiles")
      .select("profile_img")
      .eq("user_id", user.value.id)
      .single();

    if (error) throw error;

    profileImageUrl.value = data.profile_img || "";
  } catch (error) {
    console.error("Error fetching profile image:", error);
  }
});
</script>
