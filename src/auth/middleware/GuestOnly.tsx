import React from "react";
import { Navigate } from "react-router";
import { useAuth } from "../context/AuthProvider";
import { getRedirectPath } from "../utils/utils";

const GuestOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();

    if (user) {
        // Gunakan logika redirect yang sama dengan login
        const redirectPath = getRedirectPath(user.roles, user.permissions);
        return <Navigate to={redirectPath} replace />;
    }

    return <>{children}</>;
};

export default GuestOnly;
