// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  nitro: {
    preset: 'cloudflare-pages'
  },

  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss'],



  runtimeConfig: {
    adminUsername: process.env.ADMIN_USERNAME || 'admin',
    adminPassword: process.env.ADMIN_PASSWORD || 'admin123',
    sessionSecret: process.env.SESSION_SECRET || 'this-is-a-dev-secret-must-be-at-least-32-chars!!',
  },

  app: {
    head: {
      title: '積分大富翁',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '完成任務累積積分，在大富翁棋盤上前進，兌換精彩獎勵！' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;600;700;800;900&display=swap' },
      ],
    },
  },

  tailwindcss: {
    config: {
      theme: {
        extend: {
          fontFamily: {
            sans: ['"Noto Sans TC"', 'sans-serif'],
          },
          colors: {
            primary: {
              50: '#f0f4ff',
              100: '#dbe4ff',
              200: '#bac8ff',
              300: '#91a7ff',
              400: '#748ffc',
              500: '#5c7cfa',
              600: '#4c6ef5',
              700: '#4263eb',
              800: '#3b5bdb',
              900: '#364fc7',
            },
            accent: {
              50: '#fff3e0',
              100: '#ffe0b2',
              200: '#ffcc80',
              300: '#ffb74d',
              400: '#ffa726',
              500: '#ff9800',
              600: '#fb8c00',
              700: '#f57c00',
              800: '#ef6c00',
              900: '#e65100',
            },
            surface: {
              50: '#f8f9fc',
              100: '#f1f3f8',
              200: '#e4e7ef',
              300: '#d1d5e0',
              400: '#9ca3b0',
              500: '#6b7280',
              600: '#4b5563',
              700: '#374151',
              800: '#1f2937',
              900: '#111827',
            },
          },
        },
      },
    },
  },
})