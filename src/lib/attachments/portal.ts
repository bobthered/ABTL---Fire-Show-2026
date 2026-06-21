import type { Attachment } from 'svelte/attachments';

export const portal: Attachment<HTMLElement> = (node) => {
	document.body.appendChild(node);

	return () => {
		node.remove();
	};
};
