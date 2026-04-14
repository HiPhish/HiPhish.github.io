const Hyperlink = ({content}) =>
	<a href="#" onClick={(evt) => evt.preventDefault()}>{content}</a>;


export default {
	title: 'Atom/Hyperlink',
	component: Hyperlink,
	args: {
		content: 'Click me!',
	},
	parameters: {
		renderer: 'preact',
	},
};

export const Regular = {
};
