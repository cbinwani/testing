import {
	ConfigureTriggerInput,
	CreateAndStartTaskInputs,
	CreateTaskInputs,
	type Nexxonn,
	type Patch,
	StartTaskInputs,
} from "@nexxonn-ai/nexxonn";
import {
	FetchingWebPage,
	FileId,
	Generation,
	GenerationId,
	GenerationOrigin,
	GitHubEventData,
	NodeId,
	QueuedGeneration,
	RunningGeneration,
	SecretId,
	TaskId,
	Trigger,
	TriggerId,
	Workspace,
	WorkspaceId,
} from "@nexxonn-ai/protocol";
import * as z from "zod/v4";
import { createHandler, withUsageLimitErrorHandler } from "./create-handler";
import { JsonResponse } from "./json-response";

export const jsonRoutes = {
	createWorkspace: (nexxonn: Nexxonn) =>
		createHandler({
			handler: async () => {
				const workspace = await nexxonn.createWorkspace();
				return JsonResponse.json(workspace);
			},
		}),
	getWorkspace: (nexxonn: Nexxonn) =>
		createHandler({
			input: z.object({
				workspaceId: WorkspaceId.schema,
			}),
			handler: async ({ input }) => {
				const workspace = await nexxonn.getWorkspace(input.workspaceId);
				return JsonResponse.json(workspace);
			},
		}),

	updateWorkspace: (nexxonn: Nexxonn) =>
		createHandler({
			input: z.object({
				workspace: Workspace,
			}),
			handler: async ({ input }) => {
				const workspace = await nexxonn.updateWorkspace(input.workspace);
				return JsonResponse.json(workspace);
			},
		}),
	getLanguageModelProviders: (nexxonn: Nexxonn) =>
		createHandler({
			handler: () => {
				const providers = nexxonn.getLanguageModelProviders();
				return JsonResponse.json(providers);
			},
		}),
	getGeneration: (nexxonn: Nexxonn) =>
		createHandler({
			input: z.object({
				generationId: GenerationId.schema,
			}),
			handler: async ({ input }) => {
				const generation = await nexxonn.getGeneration(input.generationId);
				return JsonResponse.json(generation);
			},
		}),
	getNodeGenerations: (nexxonn: Nexxonn) =>
		createHandler({
			input: z.object({
				origin: GenerationOrigin,
				nodeId: NodeId.schema,
			}),
			handler: async ({ input }) => {
				const generations = await nexxonn.getNodeGenerations(
					input.origin,
					input.nodeId,
				);
				return JsonResponse.json(generations);
			},
		}),
	cancelGeneration: (nexxonn: Nexxonn) =>
		createHandler({
			input: z.object({
				generationId: GenerationId.schema,
			}),
			handler: async ({ input }) => {
				const generation = await nexxonn.cancelGeneration(input.generationId);
				return JsonResponse.json(generation);
			},
		}),
	removeFile: (nexxonn: Nexxonn) =>
		createHandler({
			input: z.object({
				workspaceId: WorkspaceId.schema,
				fileId: FileId.schema,
			}),
			handler: async ({ input }) => {
				await nexxonn.removeFile(input.workspaceId, input.fileId);
				return new Response(null, { status: 204 });
			},
		}),
	copyFile: (nexxonn: Nexxonn) =>
		createHandler({
			input: z.object({
				workspaceId: WorkspaceId.schema,
				sourceFileId: FileId.schema,
				destinationFileId: FileId.schema,
			}),
			handler: async ({ input }) => {
				await nexxonn.copyFile(
					input.workspaceId,
					input.sourceFileId,
					input.destinationFileId,
				);

				return new Response(null, { status: 204 });
			},
		}),
	generateImage: (nexxonn: Nexxonn) =>
		withUsageLimitErrorHandler(
			createHandler({
				input: z.object({
					generation: QueuedGeneration,
				}),
				handler: async ({ input, signal }) => {
					await nexxonn.generateImage(input.generation, signal);
					return new Response(null, { status: 204 });
				},
			}),
		),
	setGeneration: (nexxonn: Nexxonn) =>
		createHandler({
			input: z.object({
				generation: Generation,
			}),
			handler: async ({ input }) => {
				await nexxonn.setGeneration(input.generation);
				return new Response(null, { status: 204 });
			},
		}),
	createSampleWorkspaces: (nexxonn: Nexxonn) =>
		createHandler({
			handler: async () => {
				const workspaces = await nexxonn.createSampleWorkspaces();
				return JsonResponse.json(workspaces);
			},
		}),
	getGitHubRepositories: (nexxonn: Nexxonn) =>
		createHandler({
			handler: async () => {
				const repositories = await nexxonn.getGitHubRepositories();
				return JsonResponse.json(repositories);
			},
		}),
	encryptSecret: (nexxonn: Nexxonn) =>
		createHandler({
			input: z.object({ plaintext: z.string() }),
			handler: async ({ input }) => {
				return JsonResponse.json({
					encrypted: await nexxonn.encryptSecret(input.plaintext),
				});
			},
		}),
	resolveTrigger: (nexxonn: Nexxonn) =>
		createHandler({
			input: z.object({
				generation: QueuedGeneration,
			}),
			handler: async ({ input }) => {
				return JsonResponse.json({
					trigger: await nexxonn.resolveTrigger(input),
				});
			},
		}),
	configureTrigger: (nexxonn: Nexxonn) =>
		createHandler({
			input: z.object({
				trigger: ConfigureTriggerInput,
			}),
			handler: async ({ input }) => {
				return JsonResponse.json({
					triggerId: await nexxonn.configureTrigger(input),
				});
			},
		}),
	getTrigger: (nexxonn: Nexxonn) =>
		createHandler({
			input: z.object({
				triggerId: TriggerId.schema,
			}),
			handler: async ({ input }) => {
				return JsonResponse.json({
					trigger: await nexxonn.getTrigger(input),
				});
			},
		}),
	getGitHubRepositoryFullname: (nexxonn: Nexxonn) =>
		createHandler({
			input: z.object({
				repositoryNodeId: z.string(),
				installationId: z.number(),
			}),
			handler: async ({ input }) => {
				return JsonResponse.json({
					fullname: await nexxonn.getGitHubRepositoryFullname(input),
				});
			},
		}),
	setTrigger: (nexxonn: Nexxonn) =>
		createHandler({
			input: z.object({
				trigger: Trigger,
			}),
			handler: async ({ input }) => {
				return JsonResponse.json({
					triggerId: await nexxonn.setTrigger(input),
				});
			},
		}),
	reconfigureGitHubTrigger: (nexxonn: Nexxonn) =>
		createHandler({
			input: z.object({
				triggerId: TriggerId.schema,
				repositoryNodeId: z.string(),
				installationId: z.number(),
				event: GitHubEventData.optional(),
			}),
			handler: async ({ input }) => {
				return JsonResponse.json({
					triggerId: await nexxonn.reconfigureGitHubTrigger(input),
				});
			},
		}),
	deleteTrigger: (nexxonn: Nexxonn) =>
		createHandler({
			input: z.object({
				triggerId: TriggerId.schema,
			}),
			handler: async ({ input }) => {
				await nexxonn.deleteTrigger(input);
				return new Response(null, { status: 204 });
			},
		}),
	executeAction: (nexxonn: Nexxonn) =>
		createHandler({
			input: z.object({
				generation: QueuedGeneration,
			}),
			handler: async ({ input }) => {
				await nexxonn.executeAction(input);
				return new Response(null, { status: 204 });
			},
		}),
	createAndStartTask: (nexxonn: Nexxonn) =>
		createHandler({
			input: CreateAndStartTaskInputs.omit({ callbacks: true }),
			handler: async ({ input }) => {
				await nexxonn.createAndStartTask(input);
				return new Response(null, { status: 204 });
			},
		}),
	startTask: (nexxonn: Nexxonn) =>
		createHandler({
			input: StartTaskInputs,
			handler: async ({ input }) => {
				await nexxonn.startTask(input);
				return new Response(null, { status: 204 });
			},
		}),
	executeQuery: (nexxonn: Nexxonn) =>
		createHandler({
			input: z.object({
				generation: QueuedGeneration,
			}),
			handler: async ({ input }) => {
				await nexxonn.executeQuery(input.generation);
				return new Response(null, { status: 204 });
			},
		}),
	addWebPage: (nexxonn: Nexxonn) =>
		createHandler({
			input: z.object({
				webpage: FetchingWebPage,
				workspaceId: WorkspaceId.schema,
			}),
			handler: async ({ input }) =>
				JsonResponse.json(await nexxonn.addWebPage(input)),
		}),
	getFileText: (nexxonn: Nexxonn) =>
		createHandler({
			input: z.object({
				workspaceId: WorkspaceId.schema,
				fileId: FileId.schema,
			}),
			handler: async ({ input }) =>
				JsonResponse.json({
					text: await nexxonn.getFileText({
						workspaceId: input.workspaceId,
						fileId: input.fileId,
					}),
				}),
		}),
	addSecret: (nexxonn: Nexxonn) =>
		createHandler({
			input: z.object({
				workspaceId: WorkspaceId.schema,
				label: z.string(),
				value: z.string(),
				tags: z.array(z.string()).optional(),
			}),
			handler: async ({ input }) =>
				JsonResponse.json({
					secret: await nexxonn.addSecret(input),
				}),
		}),
	getWorkspaceSecrets: (nexxonn: Nexxonn) =>
		createHandler({
			input: z.object({
				workspaceId: WorkspaceId.schema,
				tags: z.array(z.string()).optional(),
			}),
			handler: async ({ input }) =>
				JsonResponse.json({
					secrets: await nexxonn.getWorkspaceSecrets(input),
				}),
		}),
	createTask: (nexxonn: Nexxonn) =>
		createHandler({
			input: CreateTaskInputs,
			handler: async ({ input }) =>
				JsonResponse.json(await nexxonn.createTask(input)),
		}),
	patchTask: (nexxonn: Nexxonn) =>
		createHandler({
			input: z.object({
				taskId: TaskId.schema,
				patches: z.array(z.custom<Patch>()),
			}),
			handler: async ({ input }) =>
				JsonResponse.json({
					task: await nexxonn.patchTask(input),
				}),
		}),
	getWorkspaceTasks: (nexxonn: Nexxonn) =>
		createHandler({
			input: z.object({
				workspaceId: WorkspaceId.schema,
			}),
			handler: async ({ input }) =>
				JsonResponse.json({
					tasks: await nexxonn.getWorkspaceTasks(input),
				}),
		}),
	deleteSecret: (nexxonn: Nexxonn) =>
		createHandler({
			input: z.object({
				workspaceId: WorkspaceId.schema,
				secretId: SecretId.schema,
			}),
			handler: async ({ input }) => {
				await nexxonn.deleteSecret(input);
				return new Response(null, { status: 204 });
			},
		}),
	streamTask: (nexxonn: Nexxonn) =>
		createHandler({
			input: z.object({
				taskId: TaskId.schema,
			}),
			handler: ({ input }) => {
				const stream = nexxonn.streamTask(input);
				return new Response(stream, {
					headers: {
						"Content-Type": "text/event-stream",
						"Cache-Control": "no-cache, no-transform",
						Connection: "keep-alive",
					},
				});
			},
		}),
	generateContent: (nexxonn: Nexxonn) =>
		createHandler({
			input: z.object({
				generation: RunningGeneration,
			}),
			handler: async ({ input }) => {
				const runningGeneration = await nexxonn.generateContent({
					...input,
				});
				return JsonResponse.json({ generation: runningGeneration });
			},
		}),
	getGenerationMessageChunks: (nexxonn: Nexxonn) =>
		createHandler({
			input: z.object({
				generationId: GenerationId.schema,
				startByte: z.number().optional(),
			}),
			handler: async ({ input, signal: abortSignal }) => {
				const data = await nexxonn.getGenerationMessageChunks({
					...input,
					abortSignal,
				});
				return JsonResponse.json(data);
			},
		}),
	startContentGeneration: (nexxonn: Nexxonn) =>
		createHandler({
			input: z.object({
				generation: Generation,
			}),
			handler: async ({ input }) => {
				const runningGeneration = await nexxonn.startContentGeneration({
					...input,
				});
				return JsonResponse.json({ generation: runningGeneration });
			},
		}),
	getWorkspaceInprogressTask: (nexxonn: Nexxonn) =>
		createHandler({
			input: z.object({
				workspaceId: WorkspaceId.schema,
			}),
			handler: async ({ input }) => {
				const task = await nexxonn.getWorkspaceInprogressTask({
					workspaceId: input.workspaceId,
				});
				return JsonResponse.json({ task });
			},
		}),
	getTaskGenerationIndexes: (nexxonn: Nexxonn) =>
		createHandler({
			input: z.object({
				taskId: TaskId.schema,
			}),
			handler: async ({ input }) => {
				const result = await nexxonn.getTaskGenerationIndexes({
					taskId: input.taskId,
				});
				return JsonResponse.json(result);
			},
		}),
	saveApp: (nexxonn: Nexxonn) =>
		createHandler({
			input: nexxonn.saveApp.inputSchema,
			handler: async ({ input }) => {
				await nexxonn.saveApp(input);
				return new Response(null, { status: 204 });
			},
		}),
	deleteApp: (nexxonn: Nexxonn) =>
		createHandler({
			input: nexxonn.deleteApp.inputSchema,
			handler: async ({ input }) => {
				await nexxonn.deleteApp(input);
				return new Response(null, { status: 204 });
			},
		}),
	getApp: (nexxonn: Nexxonn) =>
		createHandler({
			input: nexxonn.getApp.inputSchema,
			handler: async ({ input }) => {
				const app = await nexxonn.getApp(input);
				return JsonResponse.json({ app });
			},
		}),
	createApiSecret: (nexxonn: Nexxonn) =>
		createHandler({
			input: nexxonn.createApiSecret.inputSchema,
			handler: async ({ input }) => {
				const result = await nexxonn.createApiSecret(input);
				return JsonResponse.json(result);
			},
		}),
	revokeApiSecret: (nexxonn: Nexxonn) =>
		createHandler({
			input: nexxonn.revokeApiSecret.inputSchema,
			handler: async ({ input }) => {
				const result = await nexxonn.revokeApiSecret(input);
				return JsonResponse.json(result);
			},
		}),
	getCurrentApiSecretRecordForApp: (nexxonn: Nexxonn) =>
		createHandler({
			input: nexxonn.getCurrentApiSecretRecordForApp.inputSchema,
			handler: async ({ input }) => {
				const result = await nexxonn.getCurrentApiSecretRecordForApp(input);
				return JsonResponse.json(result);
			},
		}),
} as const;

// Export the types at module level
export type JsonRoutePath = keyof typeof jsonRoutes;
export type JsonRouteHandlers = {
	[P in JsonRoutePath]: ReturnType<(typeof jsonRoutes)[P]>;
};
export type JsonRouteHandlersInput = {
	[P in JsonRoutePath]: Parameters<JsonRouteHandlers[P]>[0]["input"];
};
export function isJsonRoutePath(path: string): path is JsonRoutePath {
	return path in jsonRoutes;
}

export const formDataRoutes = {
	uploadFile: (nexxonn: Nexxonn) =>
		createHandler({
			input: z.object({
				workspaceId: WorkspaceId.schema,
				fileId: FileId.schema,
				fileName: z.string(),
				file: z.instanceof(File),
			}),
			handler: async ({ input }) => {
				await nexxonn.uploadFile(
					input.file,
					input.workspaceId,
					input.fileId,
					input.fileName,
				);
				return new Response(null, { status: 202 });
			},
		}),
} as const;

// Export the types at module level
export type FormDataRoutePath = keyof typeof formDataRoutes;
export type FormDataRouteHandlers = {
	[P in FormDataRoutePath]: ReturnType<(typeof formDataRoutes)[P]>;
};
export type FormDataRouteHandlersInput = {
	[P in FormDataRoutePath]: Parameters<FormDataRouteHandlers[P]>[0]["input"];
};
export function isFormDataRoutePath(path: string): path is FormDataRoutePath {
	return path in formDataRoutes;
}
