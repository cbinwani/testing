import type { NexxonnLogger } from "./types";

const noop = (..._args: unknown[]): void => {};

export const noopLogger: NexxonnLogger = {
	info: noop,
	warn: noop,
	error: noop,
	debug: noop,
};
