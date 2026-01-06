import type { Generation } from "@nexxonn-ai/protocol";
import type { NexxonnContext } from "../types";
import { internalSetGeneration } from "./internal/set-generation";

export async function setGeneration(args: {
	context: NexxonnContext;
	generation: Generation;
}) {
	await internalSetGeneration({
		storage: args.context.storage,
		generation: args.generation,
		logger: args.context.logger,
	});
}
