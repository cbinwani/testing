import type * as z from "zod/v4";
import type { NexxonnContext } from "../types";

type HandlerArgs<TSchema extends z.ZodObject> = {
	input: z.infer<TSchema>;
	context: NexxonnContext;
};

type FunctionInputArgs<TSchema extends z.ZodObject> = {
	input: z.infer<TSchema>;
	context: NexxonnContext;
};

type NexxonnFunctionInput<
	// biome-ignore lint/suspicious/noExplicitAny: For use in utility functions
	T extends (args: { input: any; context: NexxonnContext }) => unknown,
> = Parameters<T>[0]["input"];

export function createNexxonnFunction<
	TInputSchema extends z.ZodObject,
	TOutput,
>({
	input,
	handler,
}: {
	input: TInputSchema;
	handler: (args: HandlerArgs<TInputSchema>) => TOutput;
}) {
	const fn = async (
		args: FunctionInputArgs<TInputSchema>,
	): Promise<Awaited<TOutput>> => {
		// Validate input against schema
		const validatedInput = input.parse(args.input);

		// Process request with validated input
		return await handler({
			input: validatedInput,
			context: args.context,
		});
	};

	return Object.assign(fn, { inputSchema: input });
}

/**
 * Binds a Nexxonn function to a context to be used as a Nexxonn method.
 * Transfers the inputSchema property so it can be accessed from the  instance.
 */
export function bindNexxonnFunction<
	T extends {
		inputSchema: z.ZodObject;
	} & ((args: {
		// biome-ignore lint/suspicious/noExplicitAny: For use in utility functions
		input: any;
		context: NexxonnContext;
	}) => unknown),
>(
	fn: T,
	context: NexxonnContext,
): ((input: NexxonnFunctionInput<T>) => Promise<Awaited<ReturnType<T>>>) & {
	inputSchema: T["inputSchema"];
} {
	return Object.assign(
		(input: NexxonnFunctionInput<T>) => {
			return fn({ input, context });
		},
		{ inputSchema: fn.inputSchema },
	) as ((input: NexxonnFunctionInput<T>) => Promise<Awaited<ReturnType<T>>>) & {
		inputSchema: T["inputSchema"];
	};
}
