import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { PaymentIndexSchema } from "../schema/PaymentSchema";

export const IndexPaymentResponseSchema = BaseResponseSchema(z.array(PaymentIndexSchema));
export type IndexPaymentResponse = z.infer<typeof IndexPaymentResponseSchema>;

export const PaymentMutationResponseSchema = BaseResponseSchema(PaymentIndexSchema);
export type PaymentMutationResponse = z.infer<typeof PaymentMutationResponseSchema>;

export const ShowPaymentResponseSchema = BaseResponseSchema(PaymentIndexSchema);
export type ShowPaymentResponse = z.infer<typeof ShowPaymentResponseSchema>;
