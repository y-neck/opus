export const supabaseConnection = () => {
  // Initialize and export the Supabase client
  const supabase = useSupabaseClient();
  // Initialize and export the current Supabase user
  const user = useSupabaseUser();
  return { supabase, user };
};

// Fetch profile image URL
const getProfileImageUrl = async (userId: string) => {
  const { data } = supabaseConnection()
    .supabase.storage.from('profile_img')
    .getPublicUrl(userId);
  return data?.publicUrl || '';
};
