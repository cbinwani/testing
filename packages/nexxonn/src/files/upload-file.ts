import type { FileId, WorkspaceId } from "@nexxonn-ai/protocol";
import type { NexxonnStorage } from "@nexxonn-ai/storage";
import { filePath } from "./utils";

export async function uploadFile(args: {
	storage: NexxonnStorage;
	file: File;
	workspaceId: WorkspaceId;
	fileId: FileId;
	fileName: string;
}) {
	const fileBuffer = await fileToBuffer(args.file);
	const path = filePath({
		type: "studio",
		workspaceId: args.workspaceId,
		fileId: args.fileId,
	});
	await args.storage.setBlob(path, fileBuffer);
}

async function fileToBuffer(file: File) {
	const buffer = await file.arrayBuffer();
	return Buffer.from(buffer);
}
