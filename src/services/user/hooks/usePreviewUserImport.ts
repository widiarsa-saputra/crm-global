import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { User } from "@/shared/components/facebook-style-chat/types";
import { z } from "zod";

const API_VERSION = "v1";

interface PreviewImportPayload {
    file: File;
}

// const PreviewResponseSchema = z.object({
//     success: z.boolean(),
//     preview_token: z.string(),
//     summary: z.object({
//         create: z.number(),
//         update: z.number(),
//         error: z.number()
//     }).optional(),
//     rows: z.array(z.any()).optional()
// });

const usePreviewUserImport = () => {
    return useBaseCreate<PreviewImportPayload, any, User>({
        queryKey: 'preview-import-user',
        endpoint: `${API_VERSION}/users/import-preview`,
        contentType: "multipart/form-data",
        schema: z.any(), // Using any for now to be flexible with response
    });
};

export default usePreviewUserImport;
