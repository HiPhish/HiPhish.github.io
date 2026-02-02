// @ts-check
import { defineConfig } from 'astro/config';

import preact from '@astrojs/preact';
import summary from './src/plugins/remark/summary';

// https://astro.build/config
export default defineConfig({
	site: 'https://hiphish.github.io',
	compressHTML: false,
	integrations: [
		preact()
	],
	markdown: {
		remarkPlugins: [summary],
	},
});
