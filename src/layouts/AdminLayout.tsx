import { MenuSection, ROUTES } from '@/router/AppRouter'
import SideBar from '@/shared/components/sidebar/SideBar'
import SidebarDrawer from '@/shared/components/sidebar/SidebarDrawer'
import TopBar from '@/shared/components/topbar/TopBar'
import {
    LayoutDashboard,
    BookOpen,
    FileText,
    ClipboardList,
    CreditCard,
    BarChart,
    Users,
    GraduationCap,
    ListTree,
    Layers,
    PlaySquare,
    MonitorPlay,
    CalendarDays,
    UserCheck,
    ClipboardCheck,
    BookMarked,
    SplitSquareHorizontal,
    TrendingUp
} from 'lucide-react'
import { Panel, PanelGroup, PanelResizeHandle, ImperativePanelHandle } from 'react-resizable-panels'
import React, { ElementType, useRef, useState } from 'react'

interface Props {
    children?: React.ReactNode
}

const AdminLayout: React.FC<Props> = ({ children }) => {
    const sidebarPanelRef = useRef<ImperativePanelHandle>(null);
    const [isCollapsed, setIsCollapsed] = useState(false);



    const handleSidebarToggle = (collapsed: boolean) => {
        setIsCollapsed(collapsed);
        if (sidebarPanelRef.current) {
            if (collapsed) {
                sidebarPanelRef.current.collapse();
            } else {
                sidebarPanelRef.current.expand();
            }
        }
    };

    const handlePanelCollapse = () => {
        setIsCollapsed(true);
    };

    const handlePanelExpand = () => {
        setIsCollapsed(false);
    };

    const menuSections: MenuSection[] = [
        {
            label: 'Utama',
            items: [
                { icon: LayoutDashboard as ElementType, text: 'Dashboard', url: ROUTES.SLASH.path },
            ],
            icon: LayoutDashboard as ElementType,
            order: 1
        },
        // {
        //     label: 'Learning Management',
        //     items: [
        //         { icon: BookOpen as ElementType, text: 'Course Management', url: ROUTES.COURSES.path },
        //         { icon: ListTree as ElementType, text: 'Course Categories', url: ROUTES.COURSE_CATEGORIES.path },
        //         { icon: Layers as ElementType, text: 'Course Sections', url: ROUTES.COURSE_SECTIONS.path },
        //         { icon: PlaySquare as ElementType, text: 'Lessons', url: ROUTES.LESSONS.path },
        //     ],
        //     icon: BookOpen as ElementType,
        //     order: 2
        // },
        {
            label: 'CBT & Ujian',
            items: [
                { icon: FileText as ElementType, text: 'Bank Soal', url: ROUTES.QUESTION_BANK.path },
                { icon: ListTree as ElementType, text: 'Opsi Jawaban', url: ROUTES.QUESTION_OPTIONS.path },
                { icon: ClipboardList as ElementType, text: 'Tryout', url: ROUTES.TRYOUT.path },
                { icon: Layers as ElementType, text: 'Komposisi Soal', url: ROUTES.TRYOUT_QUESTIONS.path },
                { icon: SplitSquareHorizontal as ElementType, text: 'Subtes Tryout', url: ROUTES.TRYOUT_SUBTESTS.path },
                { icon: Users as ElementType, text: 'Data Attempt', url: ROUTES.TRYOUT_ATTEMPTS.path },
                { icon: ClipboardCheck as ElementType, text: 'Jawaban Siswa', url: ROUTES.TRYOUT_ATTEMPT_ANSWERS.path },
                { icon: TrendingUp as ElementType, text: 'Hasil Subtes', url: ROUTES.TRYOUT_SUBTEST_RESULTS.path },
            ],
            icon: FileText as ElementType,
            order: 3
        },
        // {
        //     label: 'Finance',
        //     items: [
        //         { icon: CreditCard as ElementType, text: 'Transaksi', url: ROUTES.TRANSACTIONS.path },
        //         { icon: FileText as ElementType, text: 'Tagihan', url: ROUTES.INVOICES.path },
        //     ],
        //     icon: CreditCard as ElementType,
        //     order: 4
        // },
        {
            label: 'Laporan',
            items: [
                { icon: BarChart as ElementType, text: 'Perkembangan Siswa', url: ROUTES.PARENT_MONITORING.path },
            ],
            icon: BarChart as ElementType,
            order: 5
        },
        {
            label: 'Data Master',
            items: [
                { icon: Users as ElementType, text: 'Daftar Siswa', url: ROUTES.STUDENT_LIST.path },
                { icon: GraduationCap as ElementType, text: 'Daftar Tutor', url: ROUTES.TUTOR_LIST.path },
                { icon: BookOpen as ElementType, text: 'Daftar Kelas', url: ROUTES.CLASS_LIST.path },
            ],
            icon: Users as ElementType,
            order: 6
        },
        // {
        //     label: 'Kelas Online',
        //     items: [
                
        //         { icon: UserCheck as ElementType, text: 'Anggota Batch', url: ROUTES.BATCH_MEMBERS.path },
        //     ],
        //     icon: MonitorPlay as ElementType,
        //     order: 7
        // },
        // {
        //     label: 'Manajemen Program',
        //     items: [
        //         { icon: Clock as ElementType, text: 'Ketersediaan Tutor', url: ROUTES.TUTOR_AVAILABILITIES.path },
        //         { icon: ClipboardList as ElementType, text: 'Kehadiran Sesi', url: ROUTES.SESSION_ATTENDANCES.path },
        //         { icon: Receipt as ElementType, text: 'Timesheet Tutor', url: ROUTES.TUTOR_TIMESHEETS.path },
        //     ],
        //     icon: Receipt as ElementType,
        //     order: 8
        // },
    
        {
            label: 'Akademik & Konten',
            items: [
                { icon: BookOpen as ElementType, text: 'Kursus', url: ROUTES.COURSES.path },
                { icon: ListTree as ElementType, text: 'Kategori Kursus', url: ROUTES.COURSE_CATEGORIES.path },
                { icon: Layers as ElementType, text: 'Bagian Kursus', url: ROUTES.COURSE_SECTIONS.path },
                { icon: PlaySquare as ElementType, text: 'Pelajaran', url: ROUTES.LESSONS.path },
                { icon: BookOpen as ElementType, text: 'Bagian Pelajaran', url: ROUTES.LESSON_SECTIONS.path },
                { icon: FileText as ElementType, text: 'Berkas Bagian Pelajaran', url: ROUTES.LESSON_SECTION_FILES.path },
            ],
            icon: BookOpen as ElementType,
            order: 9
        },
        {
            label: 'Kurikulum & Program',
            items: [
                { icon: ClipboardList as ElementType, text: 'Kurikulum', url: ROUTES.CURRICULUMS.path },
                { icon: ListTree as ElementType, text: 'Kursus Kurikulum', url: ROUTES.CURRICULUM_COURSES.path },
                { icon: CalendarDays as ElementType, text: 'Periode', url: ROUTES.PERIODS.path },
                { icon: ClipboardCheck as ElementType, text: 'Penugasan Tryout', url: ROUTES.ASSIGN_TRYOUTS.path },
            ],
            icon: ClipboardList as ElementType,
            order: 10
        },
        {
            label: 'Pendaftaran Program',
            items: [
                { icon: BookMarked as ElementType, text: 'Pendaftaran', url: ROUTES.ENROLLMENTS.path },
                { icon: Users as ElementType, text: 'Grup Pendaftaran', url: ROUTES.ENROLLMENT_GROUPS.path },
                { icon: UserCheck as ElementType, text: 'Pendaftaran Periode', url: ROUTES.PERIOD_ENROLLMENTS.path },
                { icon: MonitorPlay as ElementType, text: 'Sesi Bimbingan', url: ROUTES.TUTORING_SESSIONS.path },
                { icon: CreditCard as ElementType, text: 'Pembayaran Siswa', url: ROUTES.PAYMENTS.path }
            ],
            icon: BookMarked as ElementType,
            order: 11
        },
    ];

    return (
        <PanelGroup direction="horizontal" className="flex h-[100dvh] bg-gray-50">
            {/* Sidebar */}
            <Panel
                ref={sidebarPanelRef}
                defaultSize={15}
                minSize={15}
                maxSize={30}
                collapsible={true}
                collapsedSize={5}
                onCollapse={handlePanelCollapse}
                onExpand={handlePanelExpand}
                className="hidden md:block"
            >
                <SideBar 
                    menuSections={menuSections} 
                    collapsed={isCollapsed} 
                    onToggle={handleSidebarToggle} 
                />
            </Panel>
            
            <PanelResizeHandle 
                onDoubleClick={() => handleSidebarToggle(!isCollapsed)}
                className="w-[1px] bg-gray-200 hover:bg-primary/50 active:bg-primary transition-colors cursor-col-resize hidden md:block" 
            />

            {/* Main Content */}
            <Panel defaultSize={80} minSize={50} className="w-full">
                <div className="flex flex-col h-full overflow-hidden w-full">
                    <TopBar />
                    <SidebarDrawer menuSections={menuSections}>
                        {children}
                    </SidebarDrawer>
                </div>
            </Panel>
        </PanelGroup>
    )
}

export default AdminLayout
