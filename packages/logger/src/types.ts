import type { Logger } from "pino";

export type NexxonnLogger = Pick<Logger, "info" | "warn" | "error" | "debug">;
