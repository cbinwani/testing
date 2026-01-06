import type { TriggerId } from "@nexxonn-ai/protocol";
import type { NexxonnContext } from "../types";
import { getTrigger as systemGetTrigger } from "./utils";

export async function getTrigger(args: {
	context: NexxonnContext;
	triggerId: TriggerId;
}) {
	return await systemGetTrigger({
		triggerId: args.triggerId,
		storage: args.context.storage,
	});
}
