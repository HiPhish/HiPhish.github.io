import Alert from './Alert.astro';


export default {
	title: 'Organism/Alert',
	component: Alert,
};

export const Info = {
	args: {
		variant: 'info',
		slots: {
			default: 'This is an informational message.'
		}
	}
};

export const Warning = {
	args: {
		variant: 'warning',
		slots: {
			default: '<strong>Warning:</strong> Something needs attention.'
		}
	}
};

export const Error = {
	args: {
		variant: 'error',
		slots: {
			default: '<strong>Error:</strong> Something really bad has happened.'
		}
	}
};
