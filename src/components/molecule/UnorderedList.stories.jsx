const UnorderedList = ({items}) =>
	<ul>
		{items.map((i) => <li>{i}</li>)}
	</ul>;


export default {
	title: 'Molecule/UnorderedLlist',
	component: UnorderedList,
	parameters: {
		renderer: 'preact',
	},
};

export const ThreeItems = {
	args: {
		items: ['Good', 'Bad', 'Ugly'],
	},
};
