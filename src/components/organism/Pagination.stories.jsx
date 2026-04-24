import Pagination from './Pagination.astro';


const makePage = (total, perPage, currentPage) => ({
	data: [],
	start: currentPage * perPage - 1,
	end: currentPage * perPage + perPage - 1,
	size: perPage,
	total: total,
	currentPage: currentPage,
	lastPage: Math.ceil(total / perPage),
	url: {
		current: '#',
		prev: '#',
		next: '#',
		first: '#',
		last: '#',
	}
});

export default {
	title: 'Organism/Pagination',
	component: Pagination,
	args: {
		page: makePage(70, 3, 4),
	},
}

export const Regular = {
};
