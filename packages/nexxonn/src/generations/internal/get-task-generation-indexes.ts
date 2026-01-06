import type { TaskId } from "@nexxonn-ai/protocol";
import { NodeGenerationIndex } from "@nexxonn-ai/protocol";
import type { NexxonnStorage } from "@nexxonn-ai/storage";
import { taskGenerationIndexesPath } from "../../path";

export async function getTaskGenerationIndexes(args: {
	taskId: TaskId;
	storage: NexxonnStorage;
}) {
	if (!(await args.storage.exists(taskGenerationIndexesPath(args.taskId)))) {
		return undefined;
	}
	return await args.storage.getJson({
		path: taskGenerationIndexesPath(args.taskId),
		schema: NodeGenerationIndex.array(),
	});
}
