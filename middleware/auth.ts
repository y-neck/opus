export default defineNuxtRouteMiddleware(async () => {
  const user = useSupabaseUser();
  // DEBUG:
  console.log(user.value);

  if (!user.value) {
    return navigateTo('/login');
  }

  // Get user from Profile table
  const { data: userProfile, error: userProfileError } =
    await supabaseConnection()
      .supabase.from('Profiles')
      .select('*')
      .eq('user_id', user.value.id);
      // DEBUG:
      console.log('User profile:', userProfile);
});
