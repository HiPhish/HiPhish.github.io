import BlockQuote from './BlockQuote.astro';


export default {
	title: 'Molecule/Block quote',
	component: BlockQuote,
	args: {
		slots: {
			default: 'Hic ducimus quasi repellendus non quisquam et. Natus dolorem aut porro velit maxime repellat necessitatibus. Minus minima omnis esse quo vel voluptatem. Iste vitae aut necessitatibus qui. Commodi ut et et nisi et.'
		}
	}
}

export const Default = {
};

export const WithParagraphs = {
	args: {
		slots: {
			default: '<p>Hic ducimus quasi repellendus non quisquam et. Natus dolorem aut porro velit maxime repellat necessitatibus. Minus minima omnis esse quo vel voluptatem. Iste vitae aut necessitatibus qui. Commodi ut et et nisi et.</p> <p>Hic ducimus quasi repellendus non quisquam et. Natus dolorem aut porro velit maxime repellat necessitatibus. Minus minima omnis esse quo vel voluptatem. Iste vitae aut necessitatibus qui. Commodi ut et et nisi et.</p>'
		}
	}
};
