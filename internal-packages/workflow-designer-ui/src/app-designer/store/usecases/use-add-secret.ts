import { useCallback } from "react";
import { useNexxonn } from "../nexxonn-client-provider";
import { useAppDesignerStore } from "../hooks";

export function useAddSecret() {
	const client = useNexxonn();
	const workspaceId = useAppDesignerStore((s) => s.workspaceId);

	return useCallback(
		async (args: { label: string; value: string }) => {
			return await client.addSecret({
				workspaceId,
				label: args.label,
				value: args.value,
			});
		},
		[client, workspaceId],
	);
}
