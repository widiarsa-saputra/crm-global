import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { CourseSectionIndexSchema } from "../schema/CourseSectionSchema";

export const CourseSectionListResponseSchema = BaseResponseSchema(z.array(CourseSectionIndexSchema));
export type CourseSectionListResponse = z.infer<typeof CourseSectionListResponseSchema>;

export const CourseSectionCreateResponseSchema = BaseResponseSchema(CourseSectionIndexSchema);
export type CourseSectionCreateResponse = z.infer<typeof CourseSectionCreateResponseSchema>;

export const CourseSectionUpdateResponseSchema = BaseResponseSchema(CourseSectionIndexSchema);
export type CourseSectionUpdateResponse = z.infer<typeof CourseSectionUpdateResponseSchema>;

export const CourseSectionShowResponseSchema = BaseResponseSchema(CourseSectionIndexSchema);
export type CourseSectionShowResponse = z.infer<typeof CourseSectionShowResponseSchema>;
