import type { APIContext, GetStaticPaths } from "astro";
import { spawnSync } from 'node:child_process';

type SBOMFormat = 'spdx' | 'cyclonedx';

export const getStaticPaths: GetStaticPaths = () => 
	(['spdx', 'cyclonedx'] as SBOMFormat[])
		.map((format) => ({params: {format}}));

export const GET = ({params: {format}}: APIContext) => {
	const sbom = spawnSync('pnpm', ['sbom', '--sbom-format', format as SBOMFormat])
		.stdout
		.toString();
	return new Response(sbom)
};
