<template>
    <AuthUpdatePasswordForm />
</template>
    
<script setup>
// Supabase auth
const user = useSupabaseUser();

console.log(user);

definePageMeta({
    title: 'Password Recovery',
    description: '',
    layout: false,
});
</script>
    
<style scoped></style>