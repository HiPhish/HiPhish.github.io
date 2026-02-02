/** A menu item of the sub-site navigation bar */
interface MenuItem {
	/** Title of the menu item. */
	title: string,
	/** URL of the menu item. */
	url: string,
	/** Identifier, unique among navigation items on a sub-site . */
	tag: string,
};

/** Properties of the sub-site navigation bar */
interface SubNavBarProps {
	/** Title of the entire sub-site */
	title: string,
	/** URL to the index page of the sub-site */
	url: string,
	/** Menu items */
	items: MenuItem[],
	/** Tag of the current item (see the item type for tags) */
	currentTag: string,
};

/** Navigation bar for sub-sites */
export default ({title, url, items, currentTag}: SubNavBarProps) => {
	const derp = ({title, url, tag}: MenuItem) => <li aria-current={tag === currentTag ? 'page': 'false'}>
		<a href={url}>{title}</a>
	</li>;

	return <nav class="local-nav">
		<ul>
			<li aria-current={!currentTag ? 'page' : 'false'}>
				<a href={url}>{title}</a>
			</li>
			{items.map(derp)}
		</ul>
	</nav>
}
