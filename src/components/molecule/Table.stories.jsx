const TableHead = ({columns}) =>
	<thead>
		<tr>
			{columns.map((c) => <th>{c}</th>)}	
		</tr>
	</thead>;

const TableRow = ({columns}) =>
	<tr>
		{columns.map((c) => <td>{c}</td>)}
	</tr>

const Table = ({head, rows}) =>
	<table>
		{head}
		<tbody>
			{rows}
		</tbody>
	</table>;


export default {
	title: 'Molecule/Table',
	component: Table,
	args: {
		head: <TableHead columns={['Technology', 'Experience']} />,
		rows: [
			<TableRow columns={['JavaScript', 'Advanced']} />,
			<TableRow columns={['Python', 'Advanced']} />,
		]
	},
	parameters: {
		renderer: 'preact',
	},
}

export const Default = {
};
