import type { WorkspaceId } from "@nexxonn-ai/protocol";
import { Task, TaskIndexObject } from "@nexxonn-ai/protocol";
import { taskPath, workspaceTaskPath } from "../path";
import type { NexxonnContext } from "../types";
import { getWorkspaceIndex } from "../utils/workspace-index";

export async function getWorkspaceTasks(args: {
	context: NexxonnContext;
	workspaceId: WorkspaceId;
}) {
	const workspaceTaskIndices = await getWorkspaceIndex({
		context: args.context,
		indexPath: workspaceTaskPath(args.workspaceId),
		itemSchema: TaskIndexObject,
	});
	const workspaceTasks = (
		await Promise.all(
			workspaceTaskIndices.map(async (workspaceTaskIndex) => {
				try {
					return await args.context.storage.getJson({
						path: taskPath(workspaceTaskIndex.id),
						schema: Task,
					});
				} catch (error) {
					const errorMessage =
						error instanceof Error ? error.message : "Unknown error";
					args.context.logger.warn(
						{
							taskId: workspaceTaskIndex.id,
							error: errorMessage,
						},
						"Failed to load workspace task; skipping.",
					);
					return null;
				}
			}),
		)
	).filter((task): task is Task => task !== null);
	return workspaceTasks;
}
