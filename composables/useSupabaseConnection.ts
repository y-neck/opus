export function useSupabaseConnection() {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser().value;


  return { supabase, user };
}