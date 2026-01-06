import type { FileId, WorkspaceId } from "@nexxonn-ai/protocol";
import type { NexxonnStorage } from "@nexxonn-ai/storage";
import { filePath } from "./utils";

export async function removeFile(args: {
	storage: NexxonnStorage;
	workspaceId: WorkspaceId;
	fileId: FileId;
}) {
	const path = filePath({
		type: "studio",
		workspaceId: args.workspaceId,
		fileId: args.fileId,
	});
	await args.storage.remove(path);
}
