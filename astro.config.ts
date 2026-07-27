// 21:27:56 [WARN] [@astrojs/mdx] `remarkPlugins`, `rehypePlugins` on `mdx({...})` are deprecated. Pass them to `unified({...})` from `@astrojs/markdown-remark` and set it as `markdown.processor` instead — MDX will inherit them. Will be removed in a future major.
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
