import Footer from './Footer.astro';

export default {
	title: 'Organism/Footer',
	component: Footer,
	args: {
		copyright: '© 2026 John Doe',
		socials: [
			{url: '#', label: 'GitHub'},
			{url: '#', label: 'GitLab'},
			{url: '#', label: 'Twitch'},
		],
	},
};

export const Regular = {
};
