export default defineNuxtRouteMiddleware(async () => {
  const user = useSupabaseUser();

  if (!user.value) {
    return navigateTo('/login');
  }

  // Get user from Profile table
    await useSupabaseConnection()
      .supabase.from('Profiles')
      .select('*')
      .eq('user_id', user.value.id);
});
