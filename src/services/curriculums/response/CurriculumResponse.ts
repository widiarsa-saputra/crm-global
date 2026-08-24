import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { CurriculumIndexSchema } from "../schema/CurriculumSchema";

export const IndexCurriculumResponseSchema = BaseResponseSchema(z.array(CurriculumIndexSchema));
export type IndexCurriculumResponse = z.infer<typeof IndexCurriculumResponseSchema>;

export const CurriculumMutationResponseSchema = BaseResponseSchema(CurriculumIndexSchema);
export type CurriculumMutationResponse = z.infer<typeof CurriculumMutationResponseSchema>;

export const ShowCurriculumResponseSchema = BaseResponseSchema(CurriculumIndexSchema);
export type ShowCurriculumResponse = z.infer<typeof ShowCurriculumResponseSchema>;
