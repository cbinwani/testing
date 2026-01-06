import type { LanguageModelProvider } from "@nexxonn-ai/language-model";
import type { NexxonnLogger } from "@nexxonn-ai/logger";
import type {
	GenerationOrigin,
	RunningGeneration,
	Task,
	WorkspaceId,
} from "@nexxonn-ai/protocol";
import type { NexxonnStorage } from "@nexxonn-ai/storage";
import type { Vault } from "@nexxonn-ai/vault";
import type { GenerationMetadata } from "../generations";
import type { TelemetrySettings } from "../telemetry";
import type { NexxonnCallbacks } from "./callbacks";
import type { ApiSecretScryptConfig } from "./config";
import type { GitHubIntegrationConfig } from "./integrations";
import type { VectorStoreQueryServices } from "./query-services";
import type {
	ConsumeAgentTimeCallback,
	FetchUsageLimitsFn,
} from "./usage-limits";
import type { WaitUntil } from "./wait-until";

type GenerateContentArgs = {
	context: NexxonnContext;
	generation: RunningGeneration;
	metadata?: GenerationMetadata;
};

type GenerateContentProcess =
	| { type: "self" }
	| { type: "external"; process: (args: GenerateContentArgs) => Promise<void> };

export type SetRunTaskProcessArgs = {
	context: NexxonnContext;
	task: Task;
	generationOriginType: GenerationOrigin["type"];
};

type RunTaskProcess =
	| { type: "self" }
	| {
			type: "external";
			process: (args: SetRunTaskProcessArgs) => Promise<void>;
	  };

export type RunTask = (args: SetRunTaskProcessArgs) => Promise<void>;

export interface NexxonnContext {
	storage: NexxonnStorage;
	sampleAppWorkspaceIds?: WorkspaceId[];
	llmProviders: LanguageModelProvider[];
	apiSecretScrypt?: ApiSecretScryptConfig;
	integrationConfigs?: {
		github?: GitHubIntegrationConfig;
	};
	onConsumeAgentTime?: ConsumeAgentTimeCallback;
	fetchUsageLimitsFn?: FetchUsageLimitsFn;
	telemetry?: {
		isEnabled?: boolean;
		waitForFlushFn?: () => Promise<unknown>;
		metadata?: TelemetrySettings["metadata"];
	};
	vault: Vault;
	vectorStoreQueryServices?: VectorStoreQueryServices;
	callbacks?: Omit<
		NexxonnCallbacks,
		"generationComplete" | "generationError" | "taskCreate"
	>;
	logger: NexxonnLogger;
	waitUntil: WaitUntil;
	generateContentProcess: GenerateContentProcess;
	runTaskProcess: RunTaskProcess;
	experimental_contentGenerationNode: boolean;
}
