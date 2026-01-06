import type { TriggerId } from "@nexxonn-ai/protocol";
import type { NexxonnContext } from "../types";
import { deleteTrigger as systemDeleteTrigger } from "./utils";

export async function deleteTrigger(args: {
	context: NexxonnContext;
	triggerId: TriggerId;
}) {
	await systemDeleteTrigger({
		triggerId: args.triggerId,
		storage: args.context.storage,
	});
}
