import useBaseShow from "@/services/base/hooks/useBaseShow";
import { z } from "zod";

const API_VERSION = "v1";

const useShowCronTest = (id: string) => {
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

export default useShowCronTest;
