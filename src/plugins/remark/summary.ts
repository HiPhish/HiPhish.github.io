// https://hunormarton.com/blog/astro-description
import type {Paragraph, PhrasingContent, Root} from 'mdast';
import { visit, EXIT } from "unist-util-visit";

function getNodeValue(node: Paragraph | PhrasingContent): string {
	if (!('children' in node)) {
		return ''
	}
	return node.children
		.map((child: PhrasingContent) => 'value' in child ? child.value : getNodeValue(child))
		.join('');
}

export default function summary() {
	return (tree: Root, file: any) => {
		visit(tree, "paragraph", (node: Paragraph) => {
			file.data.astro.frontmatter.summary = getNodeValue(node);
			return EXIT;
		});
	};
}
