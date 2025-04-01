// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  components: {
    global: true,
    dirs: ['~/components/icons', '~/components'],
  },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss', 
    '@nuxtjs/supabase', 
    '@nuxt/image', 
    '@pinia/nuxt',
    '@vite-pwa/nuxt'
  ],
  plugins: ['~/plugins/preamble.client.ts'],
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    redirect: true, // INFO: Enable if you want to redirect to login automatically; http://supabase.nuxtjs.org/get-started#redirect
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
    redirectOptions: {
      login: '/login', // Page to redirect the user to
      callback: '/confirm', // Page to redirect the user to after login
      include: undefined,
      exclude: ['/register', '/password-recovery', '/update-password'],
      cookieRedirect: false,
    },
  },
  pwa:{
    manifest:{
      name: 'Opus',
      short_name: 'Opus',
      description: 'Opus is a web-based application for managing tasks and group projects.',
      theme_color: '#000000',
      background_color: '#ffffff',
      icons: [{
              'src': './public/favicon.ico',
            }],
    },
    workbox: {
      navigateFallback: '/'
    },
    devOptions:{
      enabled: true,
      type: 'module',
    },
  },
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [
        { rel: 'icon', type: 'image/x-icon', href: './public/favicon.ico' },
        { rel: "stylesheet", href: "/styles.css" },
      ],
      htmlAttrs: {
        lang: 'en',
      },
    },
  },
});