import { type App, AppId, NodeId, WorkspaceId } from "@nexxonn-ai/protocol";
import { memoryStorageDriver } from "@nexxonn-ai/storage";
import { noopVaultDriver } from "@nexxonn-ai/vault";
import { expect, test, vi } from "vitest";
import { Nexxonn } from "../nexxonn";

test("callback.appCreate is executed when app is created if app does not exist in storage yet", async () => {
	const appCreateMock = vi.fn();
	const testNexxonn = Nexxonn({
		storage: memoryStorageDriver(),
		vault: noopVaultDriver,
		callbacks: {
			appCreate: appCreateMock,
		},
	});
	const testApp: App = {
		id: AppId.generate(),
		version: "v1",
		description: "test app description",
		state: "disconnected",
		parameters: [],
		entryNodeId: NodeId.generate(),
		workspaceId: WorkspaceId.generate(),
	};
	await testNexxonn.saveApp({ app: testApp });
	expect(appCreateMock).toHaveBeenCalled();

	// Reset the mock to check that it's not called again
	appCreateMock.mockClear();

	// When saveApp is executed again, it should not be called since
	await testNexxonn.saveApp({ app: testApp });
	expect(appCreateMock).not.toHaveBeenCalled();
});
