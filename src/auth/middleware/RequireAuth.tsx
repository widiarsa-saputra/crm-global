import React from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthProvider";

type RequireAuthProps = {
    children: React.ReactNode;
    requiredRoles?: string[];
    requiredPermissions?: string[];
    asComponent?: boolean;
    fallback?: React.ReactNode;
};

const RequireAuth: React.FC<RequireAuthProps> = ({
    children,
    requiredRoles = [],
    requiredPermissions = [],
    asComponent = false,
    fallback = null,
}) => {
    const { user, hasRole, hasPermission } = useAuth();
    const location = useLocation();

    if (!user) {
        return <Navigate to="/authentication" state={{ from: location }} replace />;
    }

    // const hasRequiredRoles = requiredRoles.some((role) => hasRole(role));
    // const hasRequiredPermissions = requiredPermissions.some((permission) =>
    //     hasPermission(permission)
    // );

    const hasRequiredRoles =
        requiredRoles.length === 0 || requiredRoles.some((role) => hasRole(role));

    const hasRequiredPermissions =
        requiredPermissions.length === 0 || requiredPermissions.some((permission) =>
            hasPermission(permission)
        );

    // Jika dua-duanya digunakan, cukup salah satu yang true
    const isAuthorized =
        (requiredRoles.length > 0 && requiredPermissions.length > 0)
            ? hasRequiredRoles || hasRequiredPermissions
            : hasRequiredRoles && hasRequiredPermissions;

    // if (!isAuthorized) {
    //     return <Navigate to="/forbidden" replace />;
    // }

    if (!isAuthorized) {
        return asComponent
            ? (fallback ?? null)
            : <Navigate to="/forbidden" replace />;
    }

    return <>{children}</>;
};

export default RequireAuth;