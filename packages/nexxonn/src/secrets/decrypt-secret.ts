import { Secret, type SecretId } from "@nexxonn-ai/protocol";
import type { NexxonnContext } from "../types";
import { secretPath } from "./paths";

export async function decryptSecret(args: {
	context: NexxonnContext;
	secretId: SecretId;
}): Promise<string | undefined> {
	const secret = await args.context.storage.getJson({
		path: secretPath(args.secretId),
		schema: Secret,
	});
	const decryptValue = await args.context.vault.decrypt(secret.value);
	if (!decryptValue) {
		return undefined;
	}

	return decryptValue;
}
