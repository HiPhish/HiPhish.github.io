import { z } from 'astro/zod';
import { defineCollection } from "astro:content";
import { globAndTransform } from './lib/blog';


const blog = defineCollection({
	loader: globAndTransform('**/*.md', 'src/content/blog'),
	schema: z.object({
		title: z.string(),
		published: z.date(),
		updated: z.date().optional(),
		slug: z.string(),
		category: z.string().optional(),
		tags: z.array(z.string()),
	})
});

export const collections = {
	blog,
};
