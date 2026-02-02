import type { JSX } from "preact/jsx-runtime";

interface MenuItem {
	title: string | JSX.Element,
	url: string,
	items?: Array<MenuItem>,
};

const left: MenuItem[] = [
	{
		title: 'Grid Framework',
		url: '/grid-framework/',
		items: [
			{
				title: 'Overview',
				url: '/grid-framework/',
			}, {
				title: 'Features',
				url: '/grid-framework/features/',
			}, {
				title: 'Examples',
				url: '/grid-framework/examples/',
			}, {
				title: 'Gallery',
				url: '/grid-framework/gallery/',
			}, {
				title: 'Showcase',
				url: '/grid-framework/showcase/',
			}, {
				title: 'FAQ',
				url: '/grid-framework/faq/',
			}, {
				title: 'News',
				url: '/grid-framework/news/',
			}, {
				title: 'Support',
				url: 'http://forum.unity3d.com/threads/grid-framework-scripting-and-editor-plugins.144886/',
			}, {
				// title: 'Buy Now <span class="badge">35$</span>',
				title: <>Buy Now <span class="badge">35$</span></>,
				url: 'https://www.assetstore.unity3d.com/#/content/62498',
			},
		],
	}, {
		title: 'Open Source',
		url: '/#products',
		items: [
			{
				title: 'NTFS-Clone',
				url: 'https://gitlab.com/HiPhish/ntfs-clone',
			}, {
				title: 'IPS-Tools',
				url: 'https://gitlab.com/HiPhish/IPS-Tools',
			}, {
				title: 'roll',
				url: 'https://gitlab.com/HiPhish/roll',
			}, {
				title: 'Newton\'s Method in C',
				url: 'https://github.com/HiPhish/Newton-method',
			}, {
				title: 'Xeen Tools',
				url: 'https://github.com/HiPhish/XeenTools',
			}, {
				title: 'Wolf3D Extract',
				url: 'https://github.com/HiPhish/Wolf3DExtract',
			}, {
				title: 'Game Source Documentation',
				url: 'https://github.com/HiPhish/Game-Source-Documentation',
			},
		],
	}, {
		title: 'Vim/Nvim plugins',
		url: '/vim/plugins/',
		items: [
			{
				title: 'Info.vim',
				url: 'https://gitlab.com/HiPhish/info.vim',
			}, {
				title: 'REPL.nvim',
				url: 'https://gitlab.com/HiPhish/repl.nvim',
			}, {
				title: 'Quicklisp.nvim',
				url: 'https://gitlab.com/HiPhish/quicklisp.nvim',
			}, {
				title: 'jinja.vim',
				url: 'https://gitlab.com/HiPhish/jinja.vim',
			}, {
				title: 'Guix channel',
				url: 'https://gitlab.com/HiPhish/neovim-guix-channel/',
			},
		],
	},
];

const right = [
	{
		title: 'Blog',
		url: '/blog/',
	}, {
		title: 'About',
		url: '/about/',
	},
];

const renderMenuItem = ({title, url, items}: MenuItem) =>
	<li hidden={!Boolean(url) && !Boolean(items)}>
		{url ? <a href={url}>{title}</a> : title}
		{items ? items.map(renderMenuItem) : null}
	</li>;

export default () => {
	return <nav>
		<input type="checkbox" id="main-nav-hamburger" hidden />
		{/* Contains the header of the navigation bar */ }
		<div>
			<a href="/">HiPhish's Workshop</a>
			<label for="main-nav-hamburger" hidden></label>
		</div>
		<ul>
			{left.map(renderMenuItem).concat(right.map(renderMenuItem))}
		</ul>
	</nav>
};
