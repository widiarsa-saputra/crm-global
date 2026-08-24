import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { z } from "zod";

const API_VERSION = "v1";

interface SendMessagePayload {
    to: string;
    message: string;
}

const useSendWhatsappMessage = () => {
    return useBaseCreate<SendMessagePayload, any, any>({
        queryKey: 'whatsapp-list',
        endpoint: `${API_VERSION}/notification-services/whatsapp/messages`,
        schema: z.any(),
    });
};

export default useSendWhatsappMessage;
