import GlobalNav from './GlobalNav.astro';

export default {
	title: 'Organism/Global navigation',
	component: GlobalNav,
	args: {
		home: {
			label: 'Dev Portfolio',
			url: '#',
		},
		entries: [
			{
				label: 'Home',
				url: '#',
			}, {
				label: 'Projects',
				url: '#',
				entries: [
					{
						label: 'Web apps',
						url: '#',
					}, {
						label: 'APIs',
						url: '#',
					},
				]
			}, {
				label: 'Blog',
				url: '#',
			}, {
				label: 'Contact',
				url: '#',
			},
		]
	},
};

export const Regular = {
};
