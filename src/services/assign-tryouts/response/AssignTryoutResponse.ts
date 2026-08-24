import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { AssignTryoutIndexSchema } from "../schema/AssignTryoutSchema";

export const IndexAssignTryoutResponseSchema = BaseResponseSchema(z.array(AssignTryoutIndexSchema));
export type IndexAssignTryoutResponse = z.infer<typeof IndexAssignTryoutResponseSchema>;

export const AssignTryoutMutationResponseSchema = BaseResponseSchema(AssignTryoutIndexSchema);
export type AssignTryoutMutationResponse = z.infer<typeof AssignTryoutMutationResponseSchema>;

export const ShowAssignTryoutResponseSchema = BaseResponseSchema(AssignTryoutIndexSchema);
export type ShowAssignTryoutResponse = z.infer<typeof ShowAssignTryoutResponseSchema>;
