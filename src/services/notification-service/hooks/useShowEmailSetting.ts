import useBaseShow from "@/services/base/hooks/useBaseShow";
import { ShowEmailSettingResponse, ShowEmailSettingResponseSchema } from "../response/ShowEmailSettingResponse";

const API_VERSION = "v1";

const useShowEmailSetting = (queryOptions?: Record<string, any>) => {
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

export default useShowEmailSetting;
