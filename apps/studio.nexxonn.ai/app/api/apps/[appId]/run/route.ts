import { verifyApiSecretForApp } from "@nexxonn-ai/nexxonn";
import {
	AppId,
	type AppParameter,
	type GenerationContextInput,
	type ParameterItem,
} from "@nexxonn-ai/protocol";
import type { NextRequest } from "next/server";
import * as z from "zod/v4";
import { nexxonn } from "@/app/nexxonn";

const requestSchema = z.object({
	text: z.string(),
});

function buildInputsFromText(args: {
	appParameters: AppParameter[];
	text: string;
}): GenerationContextInput[] {
	const multilineTextParam = args.appParameters.find(
		(p) => p.type === "multiline-text",
	);
	const singleLineTextParam = args.appParameters.find((p) => p.type === "text");
	const targetParam = multilineTextParam ?? singleLineTextParam;

	if (!targetParam) {
		throw new Error("App has no text parameter");
	}

	const items: ParameterItem[] = [
		{
			name: targetParam.id,
			type: "string",
			value: args.text,
		},
	];

	return [
		{
			type: "parameters",
			items,
		},
	];
}

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ appId: string }> },
) {
	const rawAppId = (await params).appId;
	const appIdParse = AppId.safeParse(rawAppId);
	if (!appIdParse.success) {
		return new Response("Invalid appId", { status: 400 });
	}
	const appId = appIdParse.data;

	const verifyResult = await verifyApiSecretForApp({
		context: nexxonn.getContext(),
		appId,
		authorizationHeader: request.headers.get("authorization"),
	});
	if (!verifyResult.ok) {
		return new Response("Unauthorized", { status: 401 });
	}

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return new Response("Invalid JSON body", { status: 400 });
	}

	const parsed = requestSchema.safeParse(body);
	if (!parsed.success) {
		return new Response("Invalid request body", { status: 400 });
	}

	const app = await nexxonn.getApp({ appId }).catch(() => null);
	if (!app) {
		return new Response("App not found", { status: 404 });
	}

	let inputs: GenerationContextInput[];
	try {
		inputs = buildInputsFromText({
			appParameters: app.parameters,
			text: parsed.data.text,
		});
	} catch {
		return new Response("App has no text parameter", { status: 400 });
	}

	const { task } = await nexxonn.createTask({
		workspaceId: app.workspaceId,
		nodeId: app.entryNodeId,
		inputs,
		generationOriginType: "api",
	});

	await nexxonn.startTask({
		taskId: task.id,
		generationOriginType: "api",
	});

	return Response.json({ taskId: task.id });
}
