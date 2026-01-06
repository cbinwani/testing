import type { LanguageModelProvider } from "@nexxonn-ai/language-model";
import type { NexxonnLogger } from "@nexxonn-ai/logger";
import type { WorkspaceId } from "@nexxonn-ai/protocol";
import type { NexxonnStorage } from "@nexxonn-ai/storage";
import type { Vault } from "@nexxonn-ai/vault";
import type { TelemetrySettings } from "../telemetry";
import type { NexxonnCallbacks } from "./callbacks";
import type { NexxonnIntegrationConfig } from "./integrations";
import type { VectorStoreQueryServices } from "./query-services";
import type {
	ConsumeAgentTimeCallback,
	FetchUsageLimitsFn,
} from "./usage-limits";
import type { WaitUntil } from "./wait-until";

export type ApiSecretScryptConfig = {
	params?: {
		n: number;
		r: number;
		p: number;
		keyLen: number;
	};
	saltBytes?: number;
	/**
	 * When enabled, logs derived-key duration to `logger.debug` for observability.
	 * Never logs secrets or tokens.
	 */
	logDuration?: boolean;
};

export interface NexxonnConfig {
	storage: NexxonnStorage;
	sampleAppWorkspaceIds?: WorkspaceId[];
	llmProviders?: LanguageModelProvider[];
	/**
	 * scrypt configuration for API publishing secret hashing.
	 *
	 * These values affect only newly issued API secrets because the chosen params
	 * are stored in the ApiSecretRecord for verification.
	 */
	apiSecretScrypt?: ApiSecretScryptConfig;
	integrationConfigs?: NexxonnIntegrationConfig;
	onConsumeAgentTime?: ConsumeAgentTimeCallback;
	telemetry?: {
		isEnabled?: boolean;
		waitForFlushFn?: () => Promise<unknown>;
		metadata?: TelemetrySettings["metadata"];
	};
	fetchUsageLimitsFn?: FetchUsageLimitsFn;
	vault: Vault;
	vectorStoreQueryServices?: VectorStoreQueryServices;
	callbacks?: NexxonnCallbacks;
	logger?: NexxonnLogger;
	waitUntil?: WaitUntil;
	experimental_contentGenerationNode?: boolean;
}
