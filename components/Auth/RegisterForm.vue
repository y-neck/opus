<!-- Register Form -->
<template>
    <form class="flex items-center justify-center h-screen mt-[-4rem]" @submit.prevent="handleLogin">
        <div class="flex flex-col">
            <div class="flex flex-col justify-center mb-1">
                <AuthInput label="Email" type="email" placeholder="your@email.com" v-model="email"
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" />
                <AuthInput label="Password" type="password" placeholder="••••••••••••" v-model="password" />
            </div>
            <div class="flex flex-col justify-center">
                <AuthButton :disabled="!email || !password" title="Register" />
            </div>
            <transition>
                <p v-if="errorMessage" class="flex text-sm text-grey-500 text-center mt-32 absolute ml-14">
                    {{ errorMessage }}</p>
                <p v-else-if="successMessage" class="flex text-sm text-grey-500 text-center mt-32 absolute ml-14">
                    Please check your inbox and confirm your email.
                </p>
            </transition>
        </div>
    </form>
</template>


<!-- Supabase Register Process -->
<script setup>
const supabase = useSupabaseClient()

const loading = ref(false)
const email = ref('')
const password = ref('')

const successMessage = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
    try {
        loading.value = true

        // Sign up the user
        const { error: signUpError } = await supabase.auth.signUp({
            email: email.value,
            password: password.value,
            options: {
                emailRedirectTo: 'http://localhost:3000/confirm',
            }
        })

        if (signUpError) throw signUpError

        // Insert the user data into the "Profiles" table
        const { error: insertError } = await supabase
            .from('Profiles')
            .insert({ email: email.value, password: password.value })

        if (insertError) throw insertError

        successMessage.value = true

    } catch (error) {
        errorMessage.value = error.error_description || error.message
        email.value = ''
        password.value = ''
    } finally {
        loading.value = false
    }
}
</script>



<!-- Scoped Styling -->
<style scoped>
.btn-outline {
    outline: 1px solid #F4F4F5;
}

input::-webkit-credentials-auto-fill-button {
    margin-left: 20px;
}

/* Transition classes */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>