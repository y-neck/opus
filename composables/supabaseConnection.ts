export const supabaseConnection = () => {
  // Initialize and export the Supabase client
  const supabase = useSupabaseClient();
  // Initialize and export the current Supabase user
  const user = useSupabaseUser();
  return { supabase, user };
};
