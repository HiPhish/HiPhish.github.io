import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';

import preact from '@astrojs/preact';
import summary from './src/plugins/remark/summary';
import remarkMath from 'remark-math';
import rehypeMathML from '@daiji256/rehype-mathml';
import tailwindcss from '@tailwindcss/vite';
import alpinejs from '@astrojs/alpinejs';
import mdx from '@astrojs/mdx';


// https://astro.build/config
export default defineConfig({
	site: 'https://hiphish.github.io',
	compressHTML: false,
	integrations: [
		preact(),
		alpinejs({entrypoint: '/src/alpine'}),
		mdx(),
	],
	markdown: {
		processor: unified({
			remarkPlugins: [
				summary,
				remarkMath,
			],
			rehypePlugins: [
				rehypeMathML,
			],
		}),
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
