import PostNav from './PostNav.astro';
import '../../styles/pages/blog/post.css';

export default {
	title: 'Blog/Post navigation',
	component: PostNav,
	args: {
		previous: {
			id: '#',
			data: {
				prefix: '',
				title: 'The study of Wumbo',
			},
		},
		next: {
			id: '#',
			data: {
				prefix: '',
				title: 'Uh, I can explain',
			},
		},
	},
};

/** Has a previous and next post. */
export const MiddlePost = {
};

/** Only has a next post */
export const FirstPost = {
	args: {
		previous: undefined
	}
};

/** Only has a previous post */
export const LastPost = {
	args: {
		next: undefined
	}
};
