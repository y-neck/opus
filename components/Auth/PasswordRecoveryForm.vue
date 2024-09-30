<!-- Password Recovery Form -->
<template>
    <form class="flex items-center justify-center h-screen mt-[-4rem]" @submit.prevent="recoverPassword">
        <div class="flex flex-col">
            <div class="flex flex-col justify-center mb-1">
                <AuthInput label="Email" type="email" placeholder="your@email.com" v-model="email"
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" />
            </div>
            <div class="flex flex-col justify-center">
                <AuthButton :disabled="!email || loading || success"
                    :title="loading ? 'Sending...' : (success ? 'Recovery link sent' : 'Send recovery link')" />
            </div>
        </div>
    </form>
</template>


<!-- Supabase Register Process -->
<script setup>
const supabase = useSupabaseClient()
const loading = ref(false)
const success = ref(false) // New state for success message
const email = ref('')

console.log(email.value)

const recoverPassword = async () => {
    try {
        loading.value = true
        success.value = false // Reset success state
        const { error } = await supabase.auth.resetPasswordForEmail(email.value, {
            redirectTo: 'http://localhost:3000/update-password',
        })

        if (error) throw error
        success.value = true // Set success state if no error

    } catch (error) {
        // Handle error (optional)
    } finally {
        loading.value = false // Reset loading state
    }
}
</script>
