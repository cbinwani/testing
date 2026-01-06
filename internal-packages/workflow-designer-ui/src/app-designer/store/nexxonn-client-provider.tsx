"use client";

import type { NexxonnClient } from "@nexxonn-ai/react";
import { createContext, useContext } from "react";

const NexxonnClientContext = createContext<NexxonnClient | null>(null);

export function NexxonnClientProvider({
	children,
	value,
}: React.PropsWithChildren<{ value: NexxonnClient }>) {
	return (
		<NexxonnClientContext.Provider value={value}>
			{children}
		</NexxonnClientContext.Provider>
	);
}

/**
 * Returns the Nexxonn API client injected at the app-designer root.
 *
 * Note: this intentionally uses the same name as `@nexxonn-ai/react`'s hook,
 * but is scoped to `app-designer/store`.
 */
export function useNexxonn(): NexxonnClient {
	const client = useContext(NexxonnClientContext);
	if (!client) {
		throw new Error("Missing NexxonnClientProvider in the tree");
	}
	return client;
}
