import Heading from './Heading.astro';


export default {
	title: 'Atom/Heading',
	component: Heading,
	args: {
		level: 1,
		slots: {
			default: 'This is a heading',
		},
	},
};

export const Level1 = {
};

export const Level2 = {
	args: {
		level: 2,
	},
};

export const Level3 = {
	args: {
		level: 3,
	},
};

export const Level4 = {
	args: {
		level: 4,
	},
};

export const Level5 = {
	args: {
		level: 5,
	},
};

export const Level6 = {
	args: {
		level: 6,
	},
};
