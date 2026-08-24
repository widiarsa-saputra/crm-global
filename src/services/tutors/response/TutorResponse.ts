import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { TutorIndexSchema } from "../schema/TutorSchema";

export const TutorListResponseSchema = BaseResponseSchema(z.array(TutorIndexSchema));
export type TutorListResponse = z.infer<typeof TutorListResponseSchema>;

export const TutorCreateResponseSchema = BaseResponseSchema(TutorIndexSchema);
export type TutorCreateResponse = z.infer<typeof TutorCreateResponseSchema>;

export const TutorUpdateResponseSchema = BaseResponseSchema(TutorIndexSchema);
export type TutorUpdateResponse = z.infer<typeof TutorUpdateResponseSchema>;

export const TutorShowResponseSchema = BaseResponseSchema(TutorIndexSchema);
export type TutorShowResponse = z.infer<typeof TutorShowResponseSchema>;
