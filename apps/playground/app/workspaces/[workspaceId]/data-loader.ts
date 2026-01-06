import type { WorkspaceId } from "@nexxonn-ai/protocol";
import { nexxonn } from "../../../nexxonn";

export async function dataLoader(workspaceId: WorkspaceId) {
	const data = await nexxonn.getWorkspace(workspaceId);
	const llmProviders = nexxonn.getLanguageModelProviders();
	return {
		data,
		llmProviders,
	};
}

export type LoaderData = Awaited<ReturnType<typeof dataLoader>>;
