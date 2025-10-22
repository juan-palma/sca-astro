// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
const siteURL = 'https://scadser.com.mx';
export default defineConfig({
    site: siteURL,

    integrations: [
        svelte(),
        preact(),
        sitemap({
            filter: (page) =>
                page !== `${siteURL}/en-construccion/` &&
                page !== `${siteURL}/test/`,
        })
    ],
    experimental: {
        responsiveImages: true,
    }
});