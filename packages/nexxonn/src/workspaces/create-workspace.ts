import { generateInitialWorkspace, Workspace } from "@nexxonn-ai/protocol";
import type { NexxonnContext } from "../types";
import { setWorkspace } from "./utils";

export async function createWorkspace(args: { context: NexxonnContext }) {
	const workspace = generateInitialWorkspace();
	await setWorkspace({
		workspaceId: workspace.id,
		workspace: Workspace.parse(workspace),
		context: args.context,
	});
	return workspace;
}
