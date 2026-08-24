import { privateApi } from "@/api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const API_VERSION = "v1";

const useDeleteWhatsappSession = () => {
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

export default useDeleteWhatsappSession;
