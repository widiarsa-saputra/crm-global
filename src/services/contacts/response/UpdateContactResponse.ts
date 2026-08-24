import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { SingleContactSchema } from "./IndexContactResponse";

export const UpdateContactResponseSchema = BaseResponseSchema(SingleContactSchema);
export type UpdateContactResponse = z.infer<typeof UpdateContactResponseSchema>;
