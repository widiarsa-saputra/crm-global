import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { z } from "zod";

const API_VERSION = "v1";

export interface UpdateEmailSettingPayload {
    host: string;
    port: number;
    username: string;
    password?: string;
    encryption: string;
    from_address: string;
    from_name: string;
    reply_to_address?: string;
    reply_to_name?: string;
    timeout?: number;
}

const useUpdateEmailSetting = () => {
    return useBaseUpdate<UpdateEmailSettingPayload, any, any>({
        queryKey: 'whatsapp-list',
        endpoint: () => `${API_VERSION}/notification-services/email/setting`,
        schema: z.any(),
    });
};

export default useUpdateEmailSetting;
