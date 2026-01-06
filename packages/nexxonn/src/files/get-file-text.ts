import type { FileId, WorkspaceId } from "@nexxonn-ai/protocol";
import type { NexxonnStorage } from "@nexxonn-ai/storage";
import { filePath } from "./utils";

export async function getFileText(args: {
	storage: NexxonnStorage;
	workspaceId: WorkspaceId;
	fileId: FileId;
}) {
	const path = filePath({
		type: "studio",
		workspaceId: args.workspaceId,
		fileId: args.fileId,
	});
	const blob = await args.storage.getBlob(path);
	return Buffer.from(blob).toString();
}
