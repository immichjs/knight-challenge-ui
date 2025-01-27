import tailwindcss from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2024-11-01',
	devtools: { enabled: true },
	modules: ['@nuxt/icon', '@pinia/nuxt', '@vee-validate/nuxt'],
	css: ['~/assets/css/tailwind.css'],
	ssr: false,
	vite: {
		plugins: [tailwindcss()],
	},
	runtimeConfig: {
		public: {
			baseURL: 'http://localhost:3001',
		},
	},
});
