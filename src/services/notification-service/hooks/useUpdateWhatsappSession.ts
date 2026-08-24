import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { z } from "zod";

const API_VERSION = "v1";

const useUpdateWhatsappSession = () => {
    return useBaseUpdate<Record<string, never>, any, any>({
        queryKey: 'whatsapp-list',
        endpoint: () => `${API_VERSION}/notification-services/whatsapp/session`,
        schema: z.any(),
    });
};

export default useUpdateWhatsappSession;
