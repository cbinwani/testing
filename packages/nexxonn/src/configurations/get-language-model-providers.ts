import type { NexxonnContext } from "../types";

export function getLanguageModelProviders(args: { context: NexxonnContext }) {
	return args.context.llmProviders;
}
