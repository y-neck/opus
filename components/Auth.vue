<script setup>
const supabase = useSupabaseClient()

const loading = ref(false)
const email = ref('')

const handleLogin = async () => {
  try {
    loading.value = true
    const { error } = await supabase.auth.signInWithOtp({ email: email.value })
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
  <form class="row flex-center flex" @submit.prevent="handleLogin">
    <div class="col-6 form-widget">
      <div class="flex flex-col ">
        <label class="text-sm text-grey-500" for="email">Email</label>
        <input class="h-11 w-[29rem] border border-grey-100 rounded-lg" type="email" placeholder="name@domain.com" v-model="email" />
      </div>
      <div>
        <button
        class="h-11 w-[29rem] bg-grey-100 text-grey-700 rounded-lg"
        type="submit"
        :value="loading ? 'Loading' : 'Send magic link'"
        :disabled="loading"
        >
        Send me a magic link
        </button>
      </div>
    </div>
  </form>
</template>