import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { PeriodIndexSchema } from "../schema/PeriodSchema";

export const IndexPeriodResponseSchema = BaseResponseSchema(z.array(PeriodIndexSchema));
export type IndexPeriodResponse = z.infer<typeof IndexPeriodResponseSchema>;

export const PeriodMutationResponseSchema = BaseResponseSchema(PeriodIndexSchema);
export type PeriodMutationResponse = z.infer<typeof PeriodMutationResponseSchema>;

export const ShowPeriodResponseSchema = BaseResponseSchema(PeriodIndexSchema);
export type ShowPeriodResponse = z.infer<typeof ShowPeriodResponseSchema>;
