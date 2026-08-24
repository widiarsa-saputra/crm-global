import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { useBaseDelete } from "@/services/base/hooks/useBaseDelete";
import { GeneralResponseSchema, GeneralRes } from "@/services/base/response/BaseResponseSchema";
import {
    TutorCreatePayload,
    TutorUpdatePayload,
    TutorEntity
} from "../schema/TutorSchema";
import {
    TutorListResponseSchema,
    TutorCreateResponseSchema,
    TutorUpdateResponseSchema,
    TutorShowResponseSchema,
    TutorListResponse,
    TutorShowResponse
} from "../response/TutorResponse";
import { z } from "zod";
import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import useBaseShow from "@/services/base/hooks/useBaseShow";

const queryKey = "tutors";
const API_VERSION = "v1";

export const useTutorIndex = (params?: object) => {
    return useBaseIndex<TutorListResponse>({
        request: {
            endpoint: `${API_VERSION}/${queryKey}`,
            params,
        },
        schema: TutorListResponseSchema,
        query: {
            key: queryKey,
        },
    });
};

export const useTutorShow = (id: string | number, params?: object) => {
    return useBaseShow<TutorShowResponse>({
        request: {
            endpoint: `${API_VERSION}/${queryKey}`,
            id: String(id),
            params
        },
        schema: TutorShowResponseSchema,
        query: {
            key: `${queryKey}-${id}`,
        },
    });
};

export const useTutorCreate = () => {
    return useBaseCreate<TutorCreatePayload, z.infer<typeof TutorCreateResponseSchema>, TutorEntity>({
        endpoint: `${API_VERSION}/${queryKey}`,
        schema: TutorCreateResponseSchema,
        queryKey,
    });
};

export const useTutorUpdate = () => {
    return useBaseUpdate<TutorUpdatePayload, z.infer<typeof TutorUpdateResponseSchema>, TutorEntity>({
        endpoint: `${API_VERSION}/${queryKey}`,
        schema: TutorUpdateResponseSchema,
        queryKey,
    });
};

export const useTutorDelete = () => {
    return useBaseDelete<{ id: string | number }, GeneralRes, TutorEntity>({
        endpoint: (params) => `${API_VERSION}/${queryKey}/${params.id}`,
        schema: GeneralResponseSchema,
        queryKey,
    });
};
