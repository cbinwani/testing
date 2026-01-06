import type { FileNode } from "@nexxonn-ai/protocol";

export type FileTypeConfig = {
	accept: string[];
	label: string;
	maxSize?: number;
};

export type FilePanelProps = {
	node: FileNode;
	config: FileTypeConfig;
};
