import Button from './Button.astro';


export default {
	title: 'Atom/Button',
	component: Button,
	args: {
		label: 'Text goes here',
		variant: null,
		enabled: true,
		type: 'button',
	},
}

export const Primary = {
};

export const Secondary = {
	args: {
		variant: 'secondary',
	}
};

export const Danger = {
	args: {
		variant: 'danger',
	}
};
