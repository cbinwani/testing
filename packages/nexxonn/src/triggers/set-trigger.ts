import type { Trigger } from "@nexxonn-ai/protocol";
import type { NexxonnContext } from "../types";
import { setTrigger as setTriggerInternal } from "./utils";

export async function setTrigger(args: {
	context: NexxonnContext;
	trigger: Trigger;
}) {
	await setTriggerInternal({
		storage: args.context.storage,
		trigger: args.trigger,
	});
}
