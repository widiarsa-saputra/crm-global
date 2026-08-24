import React, { ElementType, JSX } from "react";
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
import { CourseCategoryPage } from "@/features/course-categories/pages";
import { CoursePage } from "@/features/courses/pages";
import CourseBuilderPage from "@/features/courses/pages/CourseBuilderPage";
import { CourseSectionPage } from "@/features/course-sections/pages";
import { LessonPage } from "@/features/lessons/pages";
import StudentProgressPage from "@/features/parent-monitoring/pages/StudentProgressPage";
import { Folder, Lock, ShieldCheck, UserCircle, Users } from "lucide-react";
import TutorPage from "@/features/tutor/pages/TutorPage";
import StudentPage from "@/features/student/pages/StudentPage";
import { ClassPage } from "@/features/classes/pages";

import { LessonSectionPage } from "@/features/lesson-sections/pages";
import { LessonSectionFilePage } from "@/features/lesson-section-files/pages";
import { PeriodPage } from "@/features/periods/pages";
import { CurriculumPage } from "@/features/curriculums/pages";
import { CurriculumCoursePage } from "@/features/curriculum-courses/pages";
import { AssignTryoutPage } from "@/features/assign-tryouts/pages";
import { EnrollmentPage } from "@/features/enrollments/pages";
import { EnrollmentGroupPage } from "@/features/enrollment-groups/pages";
import { PeriodEnrollmentPage } from "@/features/period-enrollments/pages";
import { TutoringSessionPage } from "@/features/tutoring-sessions/pages";
import { PaymentPage } from "@/features/payments/pages";
import TryoutQuestionPage from "@/features/tryout-questions/pages/TryoutQuestionPage";
import TryoutAttemptPage from "@/features/tryout-attempts/pages/TryoutAttemptPage";
import TryoutSubtestPage from "@/features/tryout-subtests/pages/TryoutSubtestPage";
import TryoutSubtestResultPage from "@/features/tryout-subtest-results/pages/TryoutSubtestResultPage";
import TryoutAttemptAnswerPage from "@/features/tryout-attempt-answers/pages/TryoutAttemptAnswerPage";
import QuestionBankPage from "@/features/question-banks/pages/QuestionBankPage";
import TryoutManagementPage from "@/features/tryouts/pages/TryoutManagementPage";
import QuestionOptionPage from "@/features/question-options/pages/QuestionOptionPage";

type ProtectedRoute = {
    path: string;
    element: JSX.Element;
    protected: true;
    roles: string[];
    permissions?: string[];
};

export interface MenuItem {
    icon: React.ElementType;
    text: string;
    url: string;
    roles?: string[];
    permissions?: string[];
}

export interface MenuSection {
    order?: number;
    id?: string;
    label: string;
    icon: React.ElementType;
    items: MenuItem[];
    customContent?: React.ReactNode;
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



export const ROUTES: Record<string, AppRoute> = {
    SLASH: {
        path: "/",
        element: <DashboardPage />,
        protected: true,
        roles: [],
        permissions: [],
    },

    // New Prototypes

    LESSON_SECTIONS: { path: "/bagian-pelajaran", element: <LessonSectionPage />, protected: true, roles: [], permissions: [] },
    LESSON_SECTION_FILES: { path: "/berkas-bagian-pelajaran", element: <LessonSectionFilePage />, protected: true, roles: [], permissions: [] },
    PERIODS: { path: "/periode", element: <PeriodPage />, protected: true, roles: [], permissions: [] },
    CURRICULUMS: { path: "/kurikulum", element: <CurriculumPage />, protected: true, roles: [], permissions: [] },
    CURRICULUM_COURSES: { path: "/kursus-kurikulum", element: <CurriculumCoursePage />, protected: true, roles: [], permissions: [] },
    ASSIGN_TRYOUTS: { path: "/penugasan-tryout", element: <AssignTryoutPage />, protected: true, roles: [], permissions: [] },
    ENROLLMENTS: { path: "/pendaftaran", element: <EnrollmentPage />, protected: true, roles: [], permissions: [] },
    ENROLLMENT_GROUPS: { path: "/grup-pendaftaran", element: <EnrollmentGroupPage />, protected: true, roles: [], permissions: [] },
    PERIOD_ENROLLMENTS: { path: "/pendaftaran-periode", element: <PeriodEnrollmentPage />, protected: true, roles: [], permissions: [] },
    TUTORING_SESSIONS: { path: "/sesi-bimbingan", element: <TutoringSessionPage />, protected: true, roles: [], permissions: [] },
    PAYMENTS: { path: "/pembayaran", element: <PaymentPage />, protected: true, roles: [], permissions: [] },

    COURSES: {
        path: "/kursus",
        element: <CoursePage />,
        protected: true,
        roles: [],
        permissions: [],
    },
    COURSE_BUILDER: {
        path: "/kursus/:id/builder",
        element: <CourseBuilderPage />,
        protected: true,
        roles: [],
        permissions: [],
    },
    COURSE_CATEGORIES: {
        path: "/kategori-kursus",
        element: <CourseCategoryPage />,
        protected: true,
        roles: [],
        permissions: [],
    },
    COURSE_SECTIONS: {
        path: "/bagian-kursus",
        element: <CourseSectionPage />,
        protected: true,
        roles: [],
        permissions: [],
    },
    LESSONS: {
        path: "/pelajaran",
        element: <LessonPage />,
        protected: true,
        roles: [],
        permissions: [],
    },
    QUESTION_BANK: {
        path: "/bank-soal",
        element: <QuestionBankPage />,
        protected: true,
        roles: [],
        permissions: [],
    },
    QUESTION_OPTIONS: {
        path: "/opsi-jawaban",
        element: <QuestionOptionPage />,
        protected: true,
        roles: [],
        permissions: [],
    },
    TRYOUT: {
        path: "/tryout",
        element: <TryoutManagementPage />,
        protected: true,
        roles: [],
        permissions: [],
    },
    PARENT_MONITORING: {
        path: "/laporan/perkembangan-siswa",
        element: <StudentProgressPage />,
        protected: true,
        roles: [],
        permissions: [],
    },
    TUTOR_LIST: {
        path: "/tutor",
        element: <TutorPage />,
        protected: true,
        roles: [],
        permissions: [],
    },
    STUDENT_LIST: {
        path: "/siswa",
        element: <StudentPage />,
        protected: true,
        roles: [],
        permissions: [],
    },
    CLASS_LIST: {
        path: "/kelas",
        element: <ClassPage />,
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
    TRYOUT_QUESTIONS: {
        path: "/soal-tryout",
        element: <TryoutQuestionPage />,
        protected: true,
        roles: [],
        permissions: [],
    },
    TRYOUT_ATTEMPTS: {
        path: "/percobaan-tryout",
        element: <TryoutAttemptPage />,
        protected: true,
        roles: [],
        permissions: [],
    },
    TRYOUT_SUBTESTS: {
        path: "/subtes-tryout",
        element: <TryoutSubtestPage />,
        protected: true,
        roles: [],
        permissions: [],
    },

    TRYOUT_SUBTEST_RESULTS: {
        path: "/hasil-subtes-tryout",
        element: <TryoutSubtestResultPage />,
        protected: true,
        roles: [],
        permissions: [],
    },
    TRYOUT_ATTEMPT_ANSWERS: {
        path: "/jawaban-percobaan-tryout",
        element: <TryoutAttemptAnswerPage />,
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

export const userSections: MenuSection[] = [
    {
        label: "Akun Anda",
        icon: Users as ElementType,
        items: [
            {
                text: "Profil",
                url: ROUTES.PROFILE.path,
                icon: UserCircle,
                permissions: ["view_profile"]
            },
            // {
            //     text: "Ganti Password",
            //     url: ROUTES.CHANGE_PASSWORD.path,
            //     icon: Key,
            //     permissions: ["change_password"]
            // }
        ]
    },
    {
        label: "Manajemen Sistem",
        icon: Folder as ElementType,
        items: [
            {
                text: "Manajer Berkas",
                url: ROUTES.FILE_MANAGER.path,
                icon: Folder,
                permissions: ["view_file_manager"]
            },
            {
                text: "Manajemen Pengguna",
                url: ROUTES.USER_MANAGEMENT.path,
                icon: Users,
                permissions: ["view_user_management"]
            },
            {
                text: "Manajemen Peran",
                url: ROUTES.ROLES.path,
                icon: ShieldCheck,
                permissions: ["view_role_management"]
            },
            {
                text: "Manajemen Izin",
                url: ROUTES.PERMISSIONS.path,
                icon: Lock,
                permissions: ["view_permission_management"]
            },
            // {
            //     text: "Settings",
            //     url: ROUTES.ADMIN_SETTINGS.path,
            //     icon: Settings,
            //     permissions: ["view_settings"]
            // }
        ]
    }
]

const AppRouter: React.FC = () => (
    <BrowserRouter>
        <Routes>
            {Object.entries(ROUTES).map(([, config], index) => {
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
