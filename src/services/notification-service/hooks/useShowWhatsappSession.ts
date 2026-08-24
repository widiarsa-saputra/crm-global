import useBaseShow from "@/services/base/hooks/useBaseShow";
import { ShowWhatsappSessionResponse, ShowWhatsappSessionResponseSchema } from "../response/ShowWhatsappSessionResponse";

const API_VERSION = "v1";

const useShowWhatsappSession = (queryOptions?: Record<string, any>) => {
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

export default useShowWhatsappSession;
