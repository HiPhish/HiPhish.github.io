import SubNav from './SubNav.astro';

export default {
	title: 'Organism/Sub-site navigation',
	component: SubNav,
	args: {
		title: 'Sub-site',
		url: '#',
		currentTag: '',
		items: [
			{
				title: 'First entry',
				url: '#',
				tag: 'first',
			}, {
				title: 'Second entry',
				url: '#',
				tag: 'second',
			}, {
				title: 'Third entry',
				url: '#',
				tag: 'third',
			},
		],
	},
};

export const IndexPage = {
};

export const FirstPage = {
	args: {
		currentTag: 'first',
	}
};

export const SecondPage = {
	args: {
		currentTag: 'second',
	}
};

export const ThirdPage = {
	args: {
		currentTag: 'third',
	}
};
