import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { z } from "zod";

const API_VERSION = "v1";

export interface CreateCronTestPayload {
    whatsapp_to?: string;
    email_to?: string;
    message: string;
    minute_to_sent: number;
}

const useCreateCronTest = () => {
    return useBaseCreate<CreateCronTestPayload, any, any>({
        queryKey: 'whatsapp-list',
        endpoint: `${API_VERSION}/notif-cron-test`,
        schema: z.any(),
    });
};

export default useCreateCronTest;
