import { type Loader, type LoaderContext, type ParseDataOptions } from "astro/loaders";
import { z } from 'astro/zod';
import { glob } from "astro/loaders";

export const globAndTransform = (pattern: string | Array<string>, base?: string | URL) => {
	const loader = glob({pattern, base})
	return {
		name: 'globAndTransform',
		load: async (ctx: LoaderContext) => {
			const {logger} = ctx;
			const parseData = async <TData extends Record<string, unknown>>(opts: ParseDataOptions<TData>) => {
				const {id, data: {tags, published, slug}} = opts;
				const re = /^(?<year>\d{4})\/(?<month>\d{2})\/(?<day>\d{2})\/(?<implicitSlug>\S+)$/;
				const matches = re.exec(id);
				if (matches === null || matches.groups === undefined) {
					throw Error(`Blog post ID '${id}' does not match '<year>/<month>/<day>/<slug>'`);
				}
				const {year, month, day, implicitSlug} = matches.groups;

				if (!tags) {
					opts.data.tags = [];
				} else if (typeof tags === 'string') {
					opts.data.tags = tags.split(/,\s*/);
				}
				if (published === null || published === undefined) {
					opts.data.published = new Date(`${year}-${month}-${day}`);
				}
				if (slug === null || slug === undefined) {
					opts.data.slug = implicitSlug;
				}

				const result = await ctx.parseData(opts);
				logger.debug(JSON.stringify(result))
				return result satisfies TData;
			};
			const firstResult = await loader.load({...ctx, parseData});
			return firstResult
		},
	} satisfies Loader
};
