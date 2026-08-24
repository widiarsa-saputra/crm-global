import { useBaseCreate } from "@/services/base/hooks/useBaseCreate"; // <-- Ganti import ini
import {
    ChangePhotoResponse,
    ChangePhotoResponseSchema,
} from "../response/ChangePhotoResponseSchema";
import { ChangePhoto } from "../schema/ChangePhotoSchema";

const API_VERSION = "v1";

export const useChangePhoto = () => {
    // *** INI PERUBAHANNYA ***
    // Ganti useBaseUpdate menjadi useBaseCreate
    return useBaseCreate<ChangePhoto, ChangePhotoResponse, { id: string }>({
        queryKey: 'profile-list',
        endpoint: `${API_VERSION}/change-photo`,
        schema: ChangePhotoResponseSchema,
        contentType: "multipart/form-data",
    });
};