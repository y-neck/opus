<script setup>
const supabase = useSupabaseClient()

const loading = ref(false)
const email = ref('')

const handleLogin = async () => {
    try {
        loading.value = true
        const { error } = await supabase.auth.signInWithOtp({
            email: email.value,
            options: {
                emailRedirectTo: 'http://localhost:3000/setup/user-details',
            }
        })
        if (error) throw error
        alert('Check your email for the login link!')
    } catch (error) {
        alert(error.error_description || error.message)
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <form class="flex items-center justify-center h-screen mt-[-4rem]" @submit.prevent="handleLogin" ref="clearInput" @submit="submitForm">
        <div class="flex flex-col">
            <div class="flex flex-col justify-center mb-2">
                <label class="text-sm text-grey-500 mb-1" for="email">Email</label>
                <input class="w-[22.125rem] h-10 border text-grey-700 border-grey-100 rounded-lg pl-3 placeholder-grey-400 pr-2 focus:outline-none focus:border-grey-200" type="email" placeholder="name@domain.com"
                    v-model="email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" required />
            </div>
            <div class="flex flex-col justify-center">
                <button :disabled="!email" @click="showText" class="w-[22.125rem] h-10 bg-grey-100 hover:bg-grey-200 text-grey-700 rounded-lg border border-white btn-outline font-medium transition disabled:text-grey-400 disabled:transition disabled:hover:bg-grey-100" type="submit">
                    Send me a magic link
                </button>
            </div>
            <transition>
            <p v-if="isTextVisible" class="text-sm text-grey-500 text-center absolute mt-[8.5rem]">Please check your inbox. If you didn’t receive anything,<br> we likely couldn’t match the provided email to an account.</p>
            </transition>
        </div>
    </form>
</template>


<script>
export default {
  data() {
    return {
      isTextVisible: false
    };
  },
  methods: {
    isEmailValid(email) {
      const emailPattern ="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
      return emailPattern.test(email);
    },
  }
};
</script>


<style scoped>
.btn-outline {
    outline: 1px solid #F4F4F5;
}

input::-webkit-credentials-auto-fill-button {
 margin-left: 20px;
}

/* Transition classes */
.v-enter-active {
  transition: opacity 0.3s ease;
}

.v-enter-from {
  opacity: 0;
}

</style>

