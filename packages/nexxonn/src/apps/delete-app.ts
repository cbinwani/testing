import { AppId } from "@nexxonn-ai/protocol";
import * as z from "zod/v4";
import { appPath } from "../path";
import { createNexxonnFunction } from "../utils/create-nexxonn-function";

export const deleteApp = createNexxonnFunction({
	input: z.object({ appId: AppId.schema }),
	handler: async ({ context, input }) => {
		await context.storage.remove(appPath(input.appId));
		await context.callbacks?.appDelete?.({ appId: input.appId });
	},
});
