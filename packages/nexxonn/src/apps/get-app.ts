import { App, AppId } from "@nexxonn-ai/protocol";
import * as z from "zod/v4";
import { appPath } from "../path";
import { createNexxonnFunction } from "../utils/create-nexxonn-function";

export const getApp = createNexxonnFunction({
	input: z.object({ appId: AppId.schema }),
	handler: async ({ context, input }) => {
		return await context.storage.getJson({
			path: appPath(input.appId),
			schema: App,
		});
	},
});
