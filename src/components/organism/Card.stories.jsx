import Card from './Card.astro';

export default {
	title: 'Organism/Card',
	component: Card,
	args: {
		title: 'Project One',
		label: 'View',
		url: '#',
		tags: ['Node.js'],
		slots: {
			default: 'A scalable web app with REST APIs.'
		}
	},
};

export const Default = {
};
