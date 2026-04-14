import Hero from './Hero.astro';

export default {
	title: 'Organism/Hero',
	component: Hero,
	args: {
		title: 'Building Scalable Web Solutions',
		slots: {
			default: `
				<p>
					Full-stack developer specializing in modern web
					technologies, APIs, and performance optimization.
				</p>
				<div class="mt-6 space-x-4">
					<button>View Projects </button>
					<button class="secondary">Contact Me</button>
				</div>
			`
		},
	},
};

export const Regular = {
};
