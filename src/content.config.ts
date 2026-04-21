import { z } from 'astro/zod';
import { file } from 'astro/loaders';
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

export const collections = {
	blog,
	products,
};
