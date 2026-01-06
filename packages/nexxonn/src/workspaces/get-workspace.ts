import type { WorkspaceId } from "@nexxonn-ai/protocol";
import type { NexxonnContext } from "../types";
import { getWorkspace as getWorkspaceInternal } from "./utils";

export async function getWorkspace(args: {
	context: NexxonnContext;
	workspaceId: WorkspaceId;
}) {
	return await getWorkspaceInternal({
		context: args.context,
		workspaceId: args.workspaceId,
	});
}
