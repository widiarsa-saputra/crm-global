import { privateApi } from "@/api/api";
import { useMutation } from "@tanstack/react-query";

const API_VERSION = "v1";

const useExportUsers = () => {
    return useMutation({
        mutationFn: async () => {
            const response = await privateApi.get(`/${API_VERSION}/users/export`, {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `users-export-${new Date().toISOString().split('T')[0]}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            
            return response.data;
        }
    });
};

export default useExportUsers;
