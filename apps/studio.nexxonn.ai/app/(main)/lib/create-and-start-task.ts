"use server";

import type { CreateAndStartTaskInputs } from "@nexxonn-ai/nexxonn";
import type { WorkspaceId } from "@nexxonn-ai/protocol";
import { nexxonn } from "@/app/nexxonn";
import { db } from "@/db";
import { fetchCurrentUser } from "@/services/accounts";
import { isMemberOfTeam } from "@/services/teams";

async function assertCanAccessWorkspace(workspaceId: WorkspaceId) {
	const [user, workspace] = await Promise.all([
		fetchCurrentUser(),
		db.query.workspaces.findFirst({
			where: (workspaceTable, { eq }) => eq(workspaceTable.id, workspaceId),
			columns: {
				teamDbId: true,
			},
		}),
	]);

	if (!workspace) {
		throw new Error("Workspace not found");
	}

	const hasAccess = await isMemberOfTeam(user.dbId, workspace.teamDbId);
	if (!hasAccess) {
		throw new Error("You are not authorized to run tasks for this workspace");
	}
}

export async function createAndStartTask(input: CreateAndStartTaskInputs) {
	const workspaceId = input.workspaceId ?? input.workspace?.id;

	if (workspaceId === undefined) {
		throw new Error("Workspace ID is required");
	}

	await assertCanAccessWorkspace(workspaceId);

	const { task } = await nexxonn.createTask(input);
	await nexxonn.startTask({ taskId: task.id, generationOriginType: "stage" });
	return task.id;
}
