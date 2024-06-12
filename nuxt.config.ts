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
});
