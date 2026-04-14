const OrderedList = ({items}) =>
	<ol>
		{items.map((i) => <li>{i}</li>)}
	</ol>;


export default {
	title: 'Molecule/OrderedLlist',
	component: OrderedList,
	parameters: {
		renderer: 'preact',
	},
};

export const ThreeItems = {
	args: {
		items: ['Good', 'Bad', 'Ugly'],
	},
};
