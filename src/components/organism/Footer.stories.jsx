import Footer from './Footer.astro';

export default {
	title: 'Organism/Footer',
	component: Footer,
	args: {
		socials: [
			{url: '#', label: 'GitHub'},
			{url: '#', label: 'GitLab'},
			{url: '#', label: 'Twitch'},
		],
		slots: {
			default: '© 2026 John Doe'
		}
	},
};

export const Regular = {
};
