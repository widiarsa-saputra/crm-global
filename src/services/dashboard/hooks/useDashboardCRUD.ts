import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import { DashboardResponseSchema } from "../response/DashboardResponse";

export const useIndexDashboard = () => {
    return useBaseIndex({
        request: {
            endpoint: "v1/dashboard",
        },
        query: {
            key: "dashboard-data",
        },
        schema: DashboardResponseSchema,
    });
};
