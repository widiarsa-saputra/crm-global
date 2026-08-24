import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { z } from "zod";

const API_VERSION = "v1";

export interface SendEmailPayload {
    to: string;
    subject: string;
    body: string;
    is_html?: boolean;
    cc?: string[];
    bcc?: string[];
}

const useSendEmail = () => {
    return useBaseCreate<SendEmailPayload, any, any>({
        queryKey: 'whatsapp-list',
        endpoint: `${API_VERSION}/notification-services/email/send`,
        schema: z.any(),
    });
};

export default useSendEmail;
