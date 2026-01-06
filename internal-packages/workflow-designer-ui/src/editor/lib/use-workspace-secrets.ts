import useSWR from "swr";
import { useAppDesignerStore } from "../../app-designer";
import { useNexxonn } from "../../app-designer/store/nexxonn-client-provider";
export function useWorkspaceSecrets(tags?: string[]) {
	const workspaceId = useAppDesignerStore((s) => s.workspaceId);
	const client = useNexxonn();
	return useSWR(
		{
			namespace: "get-workspace-secrets",
			workspaceId,
			tags: tags ?? [],
		},
		({ workspaceId, tags }) =>
			client
				.getWorkspaceSecrets({ workspaceId, tags })
				.then((res) => res.secrets),
	);
}
