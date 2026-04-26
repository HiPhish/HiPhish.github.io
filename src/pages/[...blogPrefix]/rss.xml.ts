// See also: https://docs.astro.build/en/recipes/rss/

import type { GetStaticPaths, APIContext } from "astro";
import type { BlogPost } from '../../lib/blog/types';
import rss, { type RSSFeedItem } from '@astrojs/rss';
import { getCollection, render } from "astro:content";
import { sortPosts } from '../../lib/blog/util';

const prefixToTitle = new Map([
	['blog', 'HiPhish\'s Workshop: Blog'],
	['grid-framework/news', 'Grid Framework News'],
]);

const prefixToDescription = new Map([
	['blog', 'Software projects, various thoughts and ramblings'],
	['grid-framework/news', 'News for the Grid Framework plugin for Unity3D'],
]);

/** Convert a single blog post to an RSS feed item. */
const postToItem = async (post: BlogPost) => {
	const {id, data: {title, published, category, tags}} = post;
	const {remarkPluginFrontmatter} = await render(post);
	return {
		title,
		pubDate: published,
		categories: [category, ...tags].filter(c => c !== undefined),
		link: id,
		description: remarkPluginFrontmatter.summary,
		// I could also render the full post content
		// https://docs.astro.build/en/recipes/rss/#including-full-post-content
	} satisfies RSSFeedItem;
};

export const getStaticPaths: GetStaticPaths = async () => {
	const posts: BlogPost[] = await getCollection('blog')
	return Array.from(new Set(posts.map(({data: {prefix}}) => prefix)))
		.map(blogPrefix => ({params: {blogPrefix}}))
};


export async function GET(context: APIContext) {
	const {blogPrefix} = context.params;
	const posts = (await getCollection('blog'))
			.filter(({data: {prefix: postPrefix}}) => postPrefix === blogPrefix)
			.toSorted(sortPosts);
	
	return rss({
		title: prefixToTitle.get(blogPrefix || '') || '',
		description: prefixToDescription.get(blogPrefix || '') || '',
		site: context.site || '',
		items: await Promise.all(posts.map(postToItem)),
		customData: '<language>en</language><generator>Astro</generator>',
	})
}
