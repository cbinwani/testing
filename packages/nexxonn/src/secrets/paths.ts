import type { SecretId, WorkspaceId } from "@nexxonn-ai/protocol";

export function secretPath(secretId: SecretId) {
	return `secrets/${secretId}/secret.json`;
}

export function workspaceSecretIndexPath(workspaceId: WorkspaceId) {
	return `secrets/byWorkspace/${workspaceId}.json`;
}
