const Input = ({type, placeholder, value}) =>
	<input type={type} placeholder={placeholder} value={value} />

export default {
	title: 'Atom/Input',
	component: Input,
	parameters: {
		renderer: 'preact',
	},
}

export const Button = {
	args: {
		type: 'button',
		value: 'Click me',
	},
};

export const Checkbox = {
	render: ({}) =>
		<div>
			<div>
				<label><input type="checkbox" checked={true}/> Good</label>
			</div>
			<div>
				<label><input type="checkbox" checked={false} /> Bad</label>
			</div>
			<div>
				<label><input type="checkbox" checked={false} /> Ugly</label>
			</div>
		</div>,
};

export const Color = {
	args: {
		type: 'color',
		value: '#deadbeef'
	}
};

export const Email = {
	args: {
		type: 'email',
		placeholder: 'email address...',
		value: 'jdoe@example.com',
	},
};

export const File = {
	args: {
		type: 'file',
	}
};

export const URL = {
	args: {
		type: 'url',
		placeholder: 'URL...',
		value: 'https://www.example.com',
	},
};

export const Radio = {
	render: ({}) =>
		<div>
			<div>
				<label><input name='derp' type="radio" checked={true}/> Good</label>
			</div>
			<div>
				<label><input name='derp' type="radio" checked={false} /> Bad</label>
			</div>
			<div>
				<label><input name='derp' type="radio" checked={false} /> Ugly</label>
			</div>
		</div>,
};

export const Submit = {
	args: {
		type: 'submit',
		value: 'Submit',
	},
};

export const Text = {
	args: {
		type: 'text',
		placeholder: 'Name...',
		value: 'John Doe',
	},
};

export const Time = {
	args: {
		type: 'time',
		value: '13:37',
	},
};
