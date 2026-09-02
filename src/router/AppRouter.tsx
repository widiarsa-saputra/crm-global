import React, { JSX } from "react";
import { Routes, Route, BrowserRouter } from "react-router";
import LoginPage from "../auth/pages/LoginPage";
import ForbiddenPage from "../auth/pages/ForbiddenPage";
import RequireAuth from "../auth/middleware/RequireAuth";
import GuestOnly from "@/auth/middleware/GuestOnly";
import UserManagementPage from "@/features/user-management/pages/UserManagementPage";
import ProfilePage from "@/features/profile/pages/ProfilePage";
import PermissionsPage from "@/features/permission/pages/PermissionsPage";
import RolePage from "@/features/role/pages/RolePage";
import RoleUsersAssignedPage from "@/features/role/pages/RoleUsersAssignedPage";
import RolePermissionsAssignedPage from "@/features/role/pages/RolePermissionsAssignedPage";
import AllNotificationPage from "@/features/notification/pages/AllNotificationPage";
import NotFound from "@/shared/components/error-page/NotFound";
import FileManagerPage from "@/features/file-manager/pages/FileManagerPage";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import ContactsPage from "@/features/contacts/pages/ContactsPage";
import CampaignsPage from "@/features/campaigns/pages/CampaignsPage";
import CampaignContactsPage from "@/features/campaign-contacts/pages/CampaignContactsPage";
import TemplatesPage from "@/features/templates/pages/TemplatesPage";
import JobListPage from "@/features/job-list/pages/JobListPage";

type ProtectedRoute = {
    path: string;
    element: JSX.Element;
    protected: true;
    roles: string[];
    permissions?: string[];
};

type GuestOnlyRoute = {
    path: string;
    element: JSX.Element;
    guestOnly: true;
};

type PublicRoute = {
    path: string;
    element: JSX.Element;
};

type AppRoute = ProtectedRoute | GuestOnlyRoute | PublicRoute;

const APP_ROUTES: Record<string, AppRoute> = {
    SLASH: {
        path: "/",
        element: <DashboardPage />,
        protected: true,
        roles: [],
        permissions: [],
    },



    CONTACTS: {
        path: "/contacts",
        element: <ContactsPage />,
        protected: true,
        roles: [],
        permissions: [],
    },
    CAMPAIGNS: {
        path: "/campaigns",
        element: <CampaignsPage />,
        protected: true,
        roles: [],
        permissions: [],
    },
    CAMPAIGN_CONTACTS: {
        path: "/campaign-contacts",
        element: <CampaignContactsPage />,
        protected: true,
        roles: [],
        permissions: [],
    },
    TEMPLATES: {
        path: "/templates",
        element: <TemplatesPage />,
        protected: true,
        roles: [],
        permissions: [],
    },

    // Admin settings
    USER_MANAGEMENT: {
        path: "/manajemen-pengguna",
        element: <UserManagementPage />,
        protected: true,
        roles: [],
        permissions: [],
    },
    PERMISSIONS: {
        path: "/izin",
        element: <PermissionsPage />,
        protected: true,
        roles: [],
        permissions: [],
    },
    ROLES: {
        path: "/peran",
        element: <RolePage />,
        protected: true,
        roles: ["superadmin", 'dev'],
        permissions: [],
    },
    ROLES_USERS_ASSIGNED: {
        path: "/peran/:roleId/pengguna",
        element: <RoleUsersAssignedPage />,
        protected: true,
        roles: [],
        permissions: [],
    },
    ROLES_PERMISSIONS_ASSIGNED: {
        path: "/peran/:roleId/izin",
        element: <RolePermissionsAssignedPage />,
        protected: true,
        roles: [],
        permissions: [],
    },
    PROFILE: {
        path: "/profil",
        element: <ProfilePage />,
        protected: true,
        roles: [],
        permissions: [],
    },
    CHANGE_PASSWORD: {
        path: "/profil/ganti-kata-sandi",
        element: <ProfilePage />,
        protected: true,
        roles: [],
        permissions: [],
    },
    NOTIFICATIONS: {
        path: "/notifikasi",
        element: <AllNotificationPage />,
        protected: true,
        roles: [],
        permissions: [],
    },
    FILE_MANAGER: {
        path: "/manajer-berkas",
        element: <FileManagerPage />,
        protected: true,
        roles: [],
        permissions: [],
    },    
    JOB_LIST: {
        path: "/job-list",
        element: <JobListPage />,
        protected: true,
        roles: [],
        permissions: [],
    },

    LOGIN: {
        path: "/authentication",
        element: <LoginPage />,
        guestOnly: true,
    },
    FORBIDDEN: {
        path: "/terlarang",
        element: <ForbiddenPage />,
    },
    NOT_FOUND: {
        path: "*",
        element: <NotFound />,
    },
};

const AppRouter: React.FC = () => (
    <BrowserRouter>
        <Routes>
            {Object.entries(APP_ROUTES).map(([, config], index) => {
                let wrappedElement = config.element;

                if ("protected" in config && config.protected) {
                    wrappedElement = (
                        <RequireAuth requiredRoles={config.roles} requiredPermissions={config.permissions ?? []}>
                            {config.element}
                        </RequireAuth>
                    );
                } else if ("guestOnly" in config && config.guestOnly) {
                    wrappedElement = <GuestOnly>{config.element}</GuestOnly>;
                }

                return <Route key={index} path={config.path} element={wrappedElement} />;
            })}
        </Routes>
    </BrowserRouter>
);

export default AppRouter;
