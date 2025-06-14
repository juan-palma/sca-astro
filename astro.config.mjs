// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import svelte from '@astrojs/svelte';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://scadser.com.mx',
    integrations: [
		svelte(),
		preact(),
		sitemap({
			filter: (page) =>
			page !== 'https://scadser.com.mx/en-construccion/' &&
			page !== 'https://scadser.com.mx/test/', 
		})
	],
    image: {
        experimentalLayout: 'constrained',
    },
    experimental: {
        responsiveImages: true,
    }
});