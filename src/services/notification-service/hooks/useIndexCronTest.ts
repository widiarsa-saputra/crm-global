import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import { z } from "zod";

const API_VERSION = "v1";

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

const useIndexCronTest = (params?: any) => {
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

export default useIndexCronTest;
