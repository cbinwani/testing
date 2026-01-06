import type { Workspace } from "@nexxonn-ai/protocol";
import type { NexxonnContext } from "../types";
import { setWorkspace } from "./utils";

export async function updateWorkspace(args: {
	context: NexxonnContext;
	workspace: Workspace;
}) {
	await setWorkspace({
		workspaceId: args.workspace.id,
		workspace: args.workspace,
		context: args.context,
	});
	return args.workspace;
}
