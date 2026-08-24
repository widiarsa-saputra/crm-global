import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { SingleContactSchema } from "./IndexContactResponse";

export const CreateContactResponseSchema = BaseResponseSchema(SingleContactSchema);
export type CreateContactResponse = z.infer<typeof CreateContactResponseSchema>;
