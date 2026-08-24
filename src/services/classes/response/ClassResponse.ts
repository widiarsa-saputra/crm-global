import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { ClassIndexSchema } from "../schema/ClassSchema";

export const ClassListResponseSchema = BaseResponseSchema(z.array(ClassIndexSchema));
export type ClassListResponse = z.infer<typeof ClassListResponseSchema>;

export const ClassCreateResponseSchema = BaseResponseSchema(ClassIndexSchema);
export type ClassCreateResponse = z.infer<typeof ClassCreateResponseSchema>;

export const ClassUpdateResponseSchema = BaseResponseSchema(ClassIndexSchema);
export type ClassUpdateResponse = z.infer<typeof ClassUpdateResponseSchema>;

export const ClassShowResponseSchema = BaseResponseSchema(ClassIndexSchema);
export type ClassShowResponse = z.infer<typeof ClassShowResponseSchema>;
