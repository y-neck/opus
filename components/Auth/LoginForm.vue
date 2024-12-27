<template>
  <form
    class="flex items-center flex-col justify-center h-screen mt-[-4rem]"
    @submit.prevent="handleLogin"
  >
    <div class="flex flex-col">
      <h2 class="text-[24px] mb-6 text-grey-700">Login</h2>
      <div class="flex flex-col justify-center gap-2">
        <AuthInput
          label="Email"
          type="email"
          placeholder="your@email.com"
          v-model="email"
          aria-label="Email address"
          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
        />
        <AuthInput
          label="Password"
          type="password"
          placeholder="Password"
          v-model="password"
          aria-label="Password"
        />
      </div>
      <div class="flex flex-col justify-center">
        <AuthButton
          :disabled="!email || !password || loading"
          :title="loading ? 'Logging in...' : 'Login'"
        />
      </div>
      <transition name="fade">
        <p
          v-if="errorMessage"
          class="absolute top-1/2 left-1/2 transform -translate-x-1/2 text-sm text-destructive-red text-center"
          v-html="errorMessage"
        ></p>
      </transition>
    </div>
    <div class="text-center mt-12 text-sm text-grey-500">
      <NuxtLink to="/password-recovery">
        <p class="hover:text-grey-700 transition">Forgotten your password?</p>
      </NuxtLink>
      <NuxtLink to="/register">
        <p class="hover:text-grey-700 transition">Create Account</p>
      </NuxtLink>
    </div>
  </form>
</template>

<script setup>
const supabase = useSupabaseClient();
const router = useRouter();

const loading = ref(false);
const email = ref("");
const password = ref("");
const errorMessage = ref("");

const handleLogin = async () => {
  errorMessage.value = "";
  try {
    loading.value = true;

    const {
      data: { user },
      error: signInError,
    } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (signInError) throw signInError;

    if (!user) {
      throw new Error("No user found");
    }

    const { data: profileData, error: profileError } = await supabase
      .from("Profiles")
      .select("first_login")
      .eq("user_id", user.id)
      .single();

    if (profileError) throw profileError;

    if (profileData && profileData.first_login === true) {
      await supabase
        .from("Profiles")
        .update({ first_login: false })
        .eq("user_id", user.id);

      router.push("/task-overview");
    } else {
      router.push("/");
    }
  } catch (error) {
    console.error(error);

    if (error.status === 400 || error.code === "INVALID_LOGIN_CREDENTIALS") {
      errorMessage.value = "Incorrect email or password.";
    } else if (error.status === 429) {
      errorMessage.value = "Too many attempts. Please try again later.";
    } else {
      errorMessage.value = "An unexpected error occurred. Please try again.";
    }

    password.value = "";
    setTimeout(() => {
      errorMessage.value = "";
    }, 3000);
  } finally {
    loading.value = false;
  }
};
</script>
