// @ts-check
import { defineConfig } from 'astro/config';

import preact from '@astrojs/preact';
import summary from './src/plugins/remark/summary';
import tailwindcss from '@tailwindcss/vite';
import alpinejs from '@astrojs/alpinejs';

// https://astro.build/config
export default defineConfig({
	site: 'https://hiphish.github.io',
	compressHTML: false,
	integrations: [
		preact(),
		alpinejs({entrypoint: '/src/alpine'}),
	],
	markdown: {
		remarkPlugins: [summary],
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
