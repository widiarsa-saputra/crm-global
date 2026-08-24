import useBaseExternalShow from "@/services/base/hooks/useBaseExternalShow";
import { z } from "zod";

const WA_API_URL = import.meta.env.VITE_WA_API_URL;
const WA_API_KEY = import.meta.env.VITE_WA_API_KEY;
const WA_USER = import.meta.env.VITE_WA_USER;

const QRResponseSchema = z.object({
    success: z.boolean().optional(),
    qr: z.string().optional(),
    qrImage: z.string().optional(),
    message: z.string().optional(),
    status: z.string().optional(),
}).passthrough();

type QRResponse = z.infer<typeof QRResponseSchema>;

const useGetWhatsappQR = (sessionId: string, enabled: boolean = false) => {
    return useBaseExternalShow<QRResponse>({
        request: {
            baseURL: WA_API_URL,
            endpoint: "api/auth/qr",
            id: sessionId,
            params: { format: "image" },
            headers: {
                "Content-Type": "application/json",
                "x-api-key": WA_API_KEY,
                "x-user": WA_USER
            }
        },
        query: {
            key: "whatsapp-qr",
            enabled: enabled && !!sessionId,
            refetchInterval: 10000,
        },
        schema: QRResponseSchema,
    });
};

export default useGetWhatsappQR;

