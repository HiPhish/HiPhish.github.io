import type { APIContext, GetStaticPaths } from "astro";
import { spawnSync } from 'node:child_process';

type SBOMFormat = 'spdx' | 'cyclonedx';

export const getStaticPaths: GetStaticPaths = () => {
	const formats: SBOMFormat[] = ['spdx', 'cyclonedx'];
	return formats.map(format => ({params: {format}}))
}

export const GET = ({params: {format}}: APIContext) => {
	if (!format) {
		throw new Error('Missing SBOM format')
	}
	const sbom = spawnSync('pnpm', ['sbom', '--sbom-format', format])
		.stdout
		.toString();
	return new Response(sbom)
};
