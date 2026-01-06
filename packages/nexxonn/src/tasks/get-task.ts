import type { TaskId } from "@nexxonn-ai/protocol";
import { Task } from "@nexxonn-ai/protocol";
import { taskPath } from "../path";
import type { NexxonnContext } from "../types";

export async function getTask(args: {
	taskId: TaskId;
	context: NexxonnContext;
}) {
	const task = await args.context.storage.getJson({
		path: taskPath(args.taskId),
		schema: Task,
	});
	return task;
}
