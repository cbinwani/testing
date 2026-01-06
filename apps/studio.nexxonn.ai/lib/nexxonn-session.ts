import * as v from "valibot";
import { teamIdSchema } from "@/services/teams/validations";
import { getCookie, setCookie } from "./signed-cookie";

const COOKIE_NAME = "nexxonn-session";

const NexxonnSessionSchema = v.object({
	teamId: v.optional(teamIdSchema),
	// used in creating a new pro team flow
	checkoutSessionId: v.optional(v.string()),
});

type NexxonnSession = v.InferOutput<typeof NexxonnSessionSchema>;

export async function getNexxonnSession(): Promise<NexxonnSession | null> {
	const rawSession = await getCookie(COOKIE_NAME);
	if (rawSession == null) {
		return null;
	}
	return v.parse(NexxonnSessionSchema, rawSession);
}

export async function updateNexxonnSession(session: Partial<NexxonnSession>) {
	const currentSession = await getNexxonnSession();
	const values = v.parse(NexxonnSessionSchema, {
		...currentSession,
		...session,
	});
	await setNexxonnSession(values);
}

async function setNexxonnSession(session: NexxonnSession) {
	await setCookie(COOKIE_NAME, v.parse(NexxonnSessionSchema, session));
}
