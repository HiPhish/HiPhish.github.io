import Heading from './Heading.astro';


export default {
	title: 'Atom/Heading',
	component: Heading,
	args: {
		level: 1,
		slots: {
			default: 'This is a heading'
		}
	}
}

export const Heading1 = {
	args: {
		level: 1
	}
};

export const Heading2 = {
	args: {
		level: 2
	}
};

export const Heading3 = {
	args: {
		level: 3
	}
};

export const Heading4 = {
	args: {
		level: 4
	}
};

export const Heading5 = {
	args: {
		level: 5
	}
};

export const Heading6 = {
	args: {
		level: 6
	}
};
