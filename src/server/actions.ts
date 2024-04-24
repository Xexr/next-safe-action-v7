"use server";

import { createSafeActionClient, DEFAULT_SERVER_ERROR_MESSAGE } from "next-safe-action";
import { z } from "zod";

class ActionError extends Error {}

// Base client.
const actionClient = createSafeActionClient({
	handleReturnedServerError(e) {
		if (e instanceof ActionError) {
			return e.message;
		}

		return DEFAULT_SERVER_ERROR_MESSAGE;
	},
	handleServerErrorLog(e) {
		if (e instanceof Error && e.cause instanceof Error) {
			console.error("[Action Error]", e.message);
			console.error("[Cause]", e.cause.message);
			return;
		}
		console.error("[Action Error]", "Unknown error");
		console.error(e);
	},
	defineMetadataSchema() {
		return z.object({
			actionName: z.string(),
		});
	},
	// Define logging middleware.
}).use(async ({ next, clientInput, metadata }) => {
	console.log("LOGGING MIDDLEWARE");

	// Here we await the action execution.
	const result = await next({ ctx: null });

	console.log("Result ->", result);
	console.log("Client input ->", clientInput);
	console.log("Metadata ->", metadata);

	// And then return the result of the awaited action.
	return result;
});

// Auth client defined by extending the base one.
// Note that the same initialization options and middleware functions of the base client
// will also be used for this one.
const authActionClient = actionClient
	// Define authorization middleware.
	.use(async ({ next }) => {
		const userId = "testid_1234";

		// Return the next middleware with `userId` value in the context
		return next({ ctx: { userId } });
	});

export const testAction = authActionClient
	// We can pass the action name inside `metadata()`.
	.metadata({ actionName: "testAction" })
	// Here we pass the input schema.
	.schema(z.object({ message: z.string() }))
	// Here we get `userId` from the middleware defined in `authActionClient`.
	.action(async ({ parsedInput: { message }, ctx: { userId } }) => {
		// wait 1 sec
		await new Promise((resolve) => setTimeout(resolve, 1000));

		console.log("Message action ->", `${message} (${userId})`);

		return {
			updated: true,
		};
	});
