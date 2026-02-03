import type { CollectionEntry } from 'astro:content';

export type Collection = 'blog';
export type BlogPost = CollectionEntry<Collection>

/** The ID of a blog post destructured into its components. */
export interface BlogPostID {
	year: string,
	month: string,
	day: string,
	slug: string,
}
