import type { BlogPost, BlogPostID } from "./types";

/** Destructure a blog post ID into its individual components.
 *	
 *	@param post - The post to destructure.
 *	@returns An object with fields for all the individual components.
 */
export const destructureID = ({id}: BlogPost): BlogPostID => {
	const re = /(?<year>\d+)\/(?<month>\d+)\/(?<day>\d+)\/(?<slug>\S+)/;
	const matches = re.exec(id);
	if (matches === null || matches.groups === undefined) {
		throw Error(`Blog post ID '${id}' does not match '<year>/<month>/<day>/<slug>'`);
	}

	const {year, month, day, slug} = matches.groups;
	return {year, month, day, slug}
};

// Replace uses of this function with `oldToNew` from below
export const sortPosts = ({data: {published: d1}}: BlogPost, {data: {published: d2}}: BlogPost) =>
	Number(d2) - Number(d1);

/** Sort two blog post from older to newer. */
export const oldToNew = ({data: {published: d1}}: BlogPost, {data: {published: d2}}: BlogPost) =>
	Number(d2) - Number(d1);

/** Sort two blog post from newer to older. */
export const newToOld = ({data: {published: d1}}: BlogPost, {data: {published: d2}}: BlogPost) =>
	Number(d1) - Number(d2);
