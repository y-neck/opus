<!-- Password Recovery Form -->
<template>
    <form class="flex items-center justify-center h-screen mt-[-4rem]" @submit.prevent="updatePassword">
        <div class="flex flex-col">
            <div class="flex flex-col justify-center mt-2">
                <AuthInput label="Update password" type="password" placeholder="••••••••••••" v-model="newPassword" />
            </div>
            <div class="flex flex-col justify-center">
                <AuthButton :disabled="!newPassword" title="Send recovery link" />
            </div>
        </div>
    </form>
</template>


<!-- Supabase Register Process -->
<script setup>
const supabase = useSupabaseClient()
const loading = ref(false)
const newPassword = ref('')

const updatePassword = async () => {
    try {
        loading.value = true
        const { data, error } = await supabase.auth.updateUser({
            password: newPassword
        })


        if (error) throw error

    } catch (error) {


    } finally {

    }
}
</script>
