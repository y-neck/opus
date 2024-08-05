// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  components: {
    global: true,
    dirs: ['~/components/icons']
  },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/supabase'],
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
  app: {
    head: {
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width,initial-scale=1',
        },
        { charset: 'utf-8' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: './public/favicon.ico' },
        { rel: 'stylesheet', href: './src/styles.css' },
      ],
    },
  },
});
