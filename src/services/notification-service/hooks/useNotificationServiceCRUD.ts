import { privateApi } from "@/api/api";
import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import useBaseExternalShow from "@/services/base/hooks/useBaseExternalShow";
import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import useBaseShow from "@/services/base/hooks/useBaseShow";
import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { ShowEmailSettingResponse, ShowEmailSettingResponseSchema, ShowWhatsappSessionResponse, ShowWhatsappSessionResponseSchema } from "../response/NotificationServiceResponse";

const API_VERSION = "v1";

export interface CreateCronTestPayload {
    whatsapp_to?: string;
    email_to?: string;
    message: string;
    minute_to_sent: number;
}

export const useCreateCronTest = () => {
    return useBaseCreate<CreateCronTestPayload, any, any>({
        queryKey: 'whatsapp-list',
        endpoint: `${API_VERSION}/notif-cron-test`,
        schema: z.any(),
    });
};





export const useDeleteWhatsappSession = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async () => {
            const response = await privateApi.delete(`/${API_VERSION}/notification-services/whatsapp/session`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["whatsapp-session"] });
        }
    });
};



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

export const useGetWhatsappQR = (sessionId: string, enabled: boolean = false) => {
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









const StatusResponseSchema = z.object({
    success: z.boolean().optional(),
    exists: z.boolean().optional(),
    status: z.string().optional(),
    authenticated: z.boolean().optional(),
    message: z.string().optional(),
}).passthrough();

type StatusResponse = z.infer<typeof StatusResponseSchema>;

export const useGetWhatsappStatus = (sessionId: string, enabled: boolean = true) => {
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





const CronTestItemSchema = z.object({
    id: z.string(),
    whatsapp_to: z.string().nullable(),
    email_to: z.string().nullable(),
    message: z.string(),
    send_at: z.string(),
    status: z.string(),
    processed_at: z.string().nullable(),
    result: z.any().nullable(),
    created_at: z.string(),
    updated_at: z.string()
});

export type CronTest = z.infer<typeof CronTestItemSchema>;

const CronTestSchema = z.object({
    success: z.boolean(),
    data: z.array(CronTestItemSchema)
}).passthrough();

export const useIndexCronTest = (params?: any) => {
    return useBaseIndex<any>({
        request: {
            endpoint: `${API_VERSION}/notif-cron-test`,
        },
        schema: CronTestSchema,
        query: {
            key: "cron-test-list",
            ...params
        }
    });
};





export interface SendEmailPayload {
    to: string;
    subject: string;
    body: string;
    is_html?: boolean;
    cc?: string[];
    bcc?: string[];
}

export const useSendEmail = () => {
    return useBaseCreate<SendEmailPayload, any, any>({
        queryKey: 'whatsapp-list',
        endpoint: `${API_VERSION}/notification-services/email/send`,
        schema: z.any(),
    });
};





interface SendMessagePayload {
    to: string;
    message: string;
}

export const useSendWhatsappMessage = () => {
    return useBaseCreate<SendMessagePayload, any, any>({
        queryKey: 'whatsapp-list',
        endpoint: `${API_VERSION}/notification-services/whatsapp/messages`,
        schema: z.any(),
    });
};





export const useShowCronTest = (id: string) => {
    return useBaseShow<any>({
        request: {
            endpoint: `${API_VERSION}/notif-cron-test`,
            id
        },
        schema: z.any(),
        query: {
            key: "cron-test-detail",
            enabled: !!id
        }
    });
};





export const useShowEmailSetting = (queryOptions?: Record<string, any>) => {
    return useBaseShow<ShowEmailSettingResponse>({
        request: {
            id: "setting",
            endpoint: `${API_VERSION}/notification-services/email`,
        },
        query: {
            key: "email-setting",
            ...(queryOptions || {}),
        },
        schema: ShowEmailSettingResponseSchema,
    });
};





export const useShowWhatsappSession = (queryOptions?: Record<string, any>) => {
    return useBaseShow<ShowWhatsappSessionResponse>({
        request: {
            id: "session",
            endpoint: `${API_VERSION}/notification-services/whatsapp`,
        },
        query: {
            key: "whatsapp-session",
            ...(queryOptions || {}),
        },
        schema: ShowWhatsappSessionResponseSchema,
    });
};





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

export const useUpdateEmailSetting = () => {
    return useBaseUpdate<UpdateEmailSettingPayload, any, any>({
        queryKey: 'whatsapp-list',
        endpoint: () => `${API_VERSION}/notification-services/email/setting`,
        schema: z.any(),
    });
};





export const useUpdateWhatsappSession = () => {
    return useBaseUpdate<Record<string, never>, any, any>({
        queryKey: 'whatsapp-list',
        endpoint: () => `${API_VERSION}/notification-services/whatsapp/session`,
        schema: z.any(),
    });
};



