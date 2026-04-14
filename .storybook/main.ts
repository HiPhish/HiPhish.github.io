import type { StorybookConfig } from '@storybook-astro/framework';
import { preact } from '@storybook-astro/framework/integrations';
import tailwindcss from '@tailwindcss/vite';


export default {
	stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
	framework: {
		name: '@storybook-astro/framework',
		options: {
			sanitization: {
				// Safe to disable as long as we only run Storybook locally
				enabled: false
			},
			integrations: [
				preact(),
			],
		},
	},
	async viteFinal(config) {
		config.plugins = config.plugins || [];
		config.plugins.push(tailwindcss());
		return config;
	}
} satisfies StorybookConfig;
