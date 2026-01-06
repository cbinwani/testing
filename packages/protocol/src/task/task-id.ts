import { createIdGenerator } from "@nexxonn-ai/utils";
import type z from "zod/v4";

export const TaskId = createIdGenerator("tsk");
export type TaskId = z.infer<typeof TaskId.schema>;
