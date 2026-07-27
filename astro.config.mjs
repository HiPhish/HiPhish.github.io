// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';

import preact from '@astrojs/preact';
import summary from './src/plugins/remark/summary';
import remarkMath from 'remark-math';
import rehypeMathML from '@daiji256/rehype-mathml';
import tailwindcss from '@tailwindcss/vite';
import alpinejs from '@astrojs/alpinejs';
import mdx from '@astrojs/mdx';

const remarkPlugins = [
	summary,
	remarkMath,
];

const rehypePlugins = [
	rehypeMathML,
];

// https://astro.build/config
export default defineConfig({
	site: 'https://hiphish.github.io',
	compressHTML: false,
	integrations: [
		preact(),
		alpinejs({entrypoint: '/src/alpine'}),
		mdx({
			remarkPlugins,
			rehypePlugins,
		}),
	],
	markdown: {
		processor: unified({
			remarkPlugins,
			rehypePlugins,
		}),
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
