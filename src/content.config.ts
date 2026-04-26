import { z } from 'astro/zod';
import { file, glob } from 'astro/loaders';
import { defineCollection } from "astro:content";
import { globAndTransform } from './lib/blog';


const blog = defineCollection({
	loader: globAndTransform('**/*.md', 'src/content/blog'),
	schema: z.object({
		prefix: z.string(),
		title: z.string(),
		published: z.date(),
		modified: z.date().optional(),
		slug: z.string(),
		category: z.string().optional(),
		tags: z.array(z.string()),
	})
});

// The products to display on the front page
const products = defineCollection({
	loader: file('src/content/products.json'),
	schema: z.object({
		title: z.string(),
		url: z.string(),
		img: z.string(),
		alt: z.string(),
		description: z.string(),
	})
});

// Sub-sites of the website, can be used to build the sub-site navigation bar
const subSites = defineCollection({
	loader: file('src/content/sub-sites.json'),
	schema: z.object({
		title: z.string(),
		url: z.string(),
		items: z.array(z.object({
			title: z.string(),
			url: z.string(),
			tag: z.string(),
		})),
	})
});

const gridFrameworkExamples = defineCollection({
	loader: glob({pattern: '*.md', base: 'src/content/grid-framework/examples'}),
	schema: z.object({
		title: z.string(),
		instructions: z.string(),
	})
});

const gridFrameworkGallery = defineCollection({
	loader: file('src/content/grid-framework/gallery.json'),
	schema: z.object({
		file: z.string(),
		description: z.string(),
	})
});

export const collections = {
	blog,
	products,
	subSites,
	gridFrameworkExamples,
	gridFrameworkGallery,
};
