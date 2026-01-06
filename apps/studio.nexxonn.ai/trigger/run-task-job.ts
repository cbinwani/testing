import { TaskId } from "@nexxonn-ai/nexxonn";
import { logger, schemaTask as schemaJob } from "@trigger.dev/sdk";
import z from "zod/v4";
import { nexxonn } from "@/app/nexxonn";

export const runTaskJob = schemaJob({
	id: "run-task-job",
	schema: z.object({
		taskId: TaskId.schema,
		requestId: z.string().optional(),
		userId: z.string(),
		team: z.object({
			id: z.string<`tm_${string}`>(),
			subscriptionId: z.string().nullable(),
			activeCustomerId: z.string().nullable(),
			plan: z.enum(["free", "pro", "team", "enterprise", "internal"]),
		}),
	}),
	run: async (payload) => {
		await nexxonn.runTask({
			taskId: payload.taskId,
			logger,
			metadata: {
				userId: payload.userId,
				team: payload.team,
				requestId: payload.requestId,
			},
		});
	},
});
