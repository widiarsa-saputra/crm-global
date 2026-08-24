import useBaseExternalShow from "@/services/base/hooks/useBaseExternalShow";
import { z } from "zod";

const WA_API_URL = import.meta.env.VITE_WA_API_URL;
const WA_API_KEY = import.meta.env.VITE_WA_API_KEY;
const WA_USER = import.meta.env.VITE_WA_USER;

const StatusResponseSchema = z.object({
    success: z.boolean().optional(),
    exists: z.boolean().optional(),
    status: z.string().optional(),
    authenticated: z.boolean().optional(),
    message: z.string().optional(),
}).passthrough();

type StatusResponse = z.infer<typeof StatusResponseSchema>;

const useGetWhatsappStatus = (sessionId: string, enabled: boolean = true) => {
    return useBaseExternalShow<StatusResponse>({
        request: {
            baseURL: WA_API_URL,
            endpoint: "api/auth/status",
            id: sessionId,
            headers: {
                "Content-Type": "application/json",
                "x-api-key": WA_API_KEY,
                "x-user": WA_USER
            }
        },
        query: {
            key: "whatsapp-status",
            enabled: enabled && !!sessionId,
            refetchInterval: (query) => {
                if (query.state.data?.status === 'ready') return false;
                return 10000;
            }
        },
        schema: StatusResponseSchema,
    });
};

export default useGetWhatsappStatus;

