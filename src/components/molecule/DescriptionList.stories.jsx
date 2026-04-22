const DescriptionList = ({term, description}) =>
	<dl>
		<dt>{term}</dt>
		<dd>{description}</dd>
	</dl>;

export default {
	title: 'Molecule/DescriptionList',
	component: DescriptionList,
	args: {
		term: 'Term',
		description: 'Description',
	},
	parameters: {
		renderer: 'preact',
	},
}


export const Regular = {
	args: {
		term: 'Firefox',
		description: `
			A free, open source, cross-platform, graphical web browser
			developed by the Mozilla Corporation and hundreds of volunteers.
		`
	}
};
