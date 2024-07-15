// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/supabase'],

  app: {
    head: {
      title: '',
      meta: [{ name: 'description', content: '' }],
    },
  },

  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    redirect: false, // Enable if you want to redirect to login automatically; http://supabase.nuxtjs.org/get-started#redirect
    redirectOptions: {
      login: '/login', // Page to redirect the user to
      callback: '/confirm', // Page to redirect the user to after login
      include: undefined,
      exclude: [],
      cookieRedirect: false,
    },
  },

  compatibilityDate: '2024-07-15',
});