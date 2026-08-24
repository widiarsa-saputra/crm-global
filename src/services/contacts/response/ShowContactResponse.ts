import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { SingleContactSchema } from "./IndexContactResponse";

export const ShowContactResponseSchema = BaseResponseSchema(SingleContactSchema);
export type ShowContactResponse = z.infer<typeof ShowContactResponseSchema>;
