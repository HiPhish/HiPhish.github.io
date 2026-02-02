export interface LibreJsEntryProps {
	license: string,
	url: string,
	originalUrl: string,
	licenseUrl: string,
}

export default ({license, url, originalUrl, licenseUrl}: LibreJsEntryProps) => {
	const name = url.split('/').at(-1);
	return <tr>
		<td>
			<a href={url}>{name}</a>
		</td>
		<td>
			<a href={licenseUrl}>{license}</a>
		</td>
		<td>
			<a href={originalUrl}>{name}</a>
		</td>
	</tr>
}
