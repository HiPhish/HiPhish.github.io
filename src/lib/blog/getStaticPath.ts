/** Implementations of `getStaticPath` for various blog pages */

import type { GetStaticPaths, GetStaticPathsOptions } from "astro";
import type {Collection, BlogPost} from './types';
import {destructureID} from './util';
import {getCollection} from 'astro:content';


/** Implementation of `getStaticPath` for the blog index page. */
const index = (collection: Collection) =>
	(async ({paginate}: GetStaticPathsOptions) => {
		const allPosts: BlogPost[] = (await getCollection(collection))
			.toSorted(({data: {published: d1}}, {data: {published: d2}}) => Number(d2) - Number(d1));
		return paginate(allPosts, {pageSize: 10});
	}) satisfies GetStaticPaths;

const year = (collection: Collection) =>
	(async ({}: GetStaticPathsOptions) => {
		const allPosts = await getCollection(collection);

		const parseId = ({id}: BlogPost) => {
			const re = /^(?<year>\d+)\/(?<month>\d+)\/(?<day>\d+)\/(?<slug>\S+)/;
			const matches = re.exec(id);
			if (matches === null || matches.groups === undefined) {
				throw Error(`Blog post ID '${id}' does not match '<year>/<month>/<day>/<slug>'`);
			}
			const {year} = matches.groups;
			return year
		};

		const parseKey = (key: string) => {
			const re = /^(?<year>\d+)/;
			const matches = re.exec(key);
			if (matches === null || matches.groups === undefined) {
				throw Error(`Blog post key '${key}' does not match '<year>/<month>'`);
			}
			const {year} = matches.groups;
			return {year};
		};

		const buckets = Map.groupBy(allPosts, parseId)
		return Array.from(buckets, ([key, posts]) => ({params: parseKey(key), props: {posts}}))
	}) satisfies GetStaticPaths;

const month = (collection: Collection) =>
	(async ({}: GetStaticPathsOptions) => {
		const allPosts = await getCollection(collection);

		const parseId = ({id}: BlogPost) => {
			const re = /(?<year>\d+)\/(?<month>\d+)\/(?<day>\d+)\/(?<slug>\S+)/;
			const matches = re.exec(id);
			if (matches === null || matches.groups === undefined) {
				throw Error(`Blog post ID '${id}' does not match '<year>/<month>/<day>/<slug>'`);
			}
			const {year, month} = matches.groups;
			return `${year}/${month}`
		};

		const parseKey = (key: string) => {
			const re = /(?<year>\d+)\/(?<month>\d+)/;
			const matches = re.exec(key);
			if (matches === null || matches.groups === undefined) {
				throw Error(`Blog post key '${key}' does not match '<year>/<month>'`);
			}
			const {year, month} = matches.groups;
			return {year, month};
		};

		const buckets = Map.groupBy(allPosts, parseId)
		return Array.from(buckets, ([key, posts]) => ({params: parseKey(key), props: {posts}}))

	}) satisfies GetStaticPaths;

const post = (collection: Collection) =>
	(async ({}: GetStaticPathsOptions) => {
		const posts = await getCollection(collection);
		return posts.map((post) => ({
			params: {...destructureID(post)},
			props: {post, allPosts: posts},
		}));
	}) satisfies GetStaticPaths;

const category = (collection: Collection) =>
	(async ({paginate}: GetStaticPathsOptions) => {
		const posts: BlogPost[] = await getCollection(collection);
		const result = Array
			.from(Map.groupBy(posts, ({data: {category}}) => category))
			.filter(([c, _]) => Boolean(c))
			.flatMap(([category, ps]) =>
				paginate(
					ps.toSorted(({data: {published: d1}}, {data: {published: d2}}) => Number(d2) - Number(d1)),
					{pageSize: 10, params: {category}}));
		return result
	}) satisfies GetStaticPaths;

const tag = (collection: Collection) =>
	(async ({paginate}: GetStaticPathsOptions) => {
		const posts: BlogPost[] = await getCollection(collection);
		const tagsAndPosts: [string, BlogPost][] = posts
			.flatMap((post: BlogPost) => post.data.tags.map((tag: string): [string, BlogPost] => [tag, post]))
		const tags = Array
			.from(Map.groupBy(tagsAndPosts, ([tag, _]) => tag))
			.map(([tag, tagsAndPosts]) =>
				[tag, tagsAndPosts.map(([_, post]) => post)] satisfies [string, BlogPost[]])
			.toSorted(([t1, _ps1], [t2, _ps2]) => t1 < t2 ? -1 : 1)
		const result = tags
			.flatMap(([tag, ps]) =>
				paginate(
					ps.toSorted(({data: {published: d1}}, {data: {published: d2}}) => Number(d2) - Number(d1)),
					{pageSize: 10, props: {posts}, params: {tag}}));
		return result
	}) satisfies GetStaticPaths;


export {
	type BlogPost,
	index,
	year as yearArchive,
	month as monthArchive,
	post as postPage,
	category as categoryArchive,
	tag as tagArchive,
};
