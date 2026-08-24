import React, { useMemo, useState, useEffect } from 'react';
import { BaseTable } from '@/shared/components/table/BaseTable';
import PaginationWithShow from '@/shared/components/pagination/PaginationWithShow';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { useTopbarActions, TopbarActions } from '@/shared/context/TopbarActionContext';
import {
    StudentMonthlyProgressEntity,
    useStudentProgressIndex,
    useStudentProgressShow,
} from '@/services/student-progress';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import ProgressStatCards from './ProgressStatCards';
import ProgressTrendChart from './ProgressTrendChart';
import StudentProgressCalculateTrigger from './StudentProgressCalculateTrigger';

// Sub-component: expanded detail panel — fetch trend per siswa
const ExpandedDetail: React.FC<{ studentId: string | number; studentName?: string | null }> = ({
    studentId, studentName,
}) => {
    const { data: detail, isLoading } = useStudentProgressShow(studentId);

    if (isLoading) {
        return <div className="p-4 text-sm text-muted-foreground animate-pulse">Memuat detail...</div>;
    }

    const latest = detail?.data?.latest;
    const trend = detail?.data?.trend ?? [];

    return (
        <div className="rounded-lg border bg-card p-4 flex flex-col gap-4">
            <div className="font-medium text-sm">
                Detail Progress: {studentName ?? `Siswa #${studentId}`}
            </div>
            {latest ? (
                <ProgressStatCards item={latest} />
            ) : (
                <p className="text-sm text-muted-foreground">Belum ada data snapshot untuk siswa ini.</p>
            )}
            {trend.length > 0 && (
                <ProgressTrendChart data={trend} studentName={studentName} />
            )}
        </div>
    );
};

const now = new Date();

const StudentProgressMainContent: React.FC = () => {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [expandedId, setExpandedId] = useState<string | number | null>(null);
    const [filterMonth, setFilterMonth] = useState(now.getMonth() + 1);
    const [filterYear, setFilterYear] = useState(now.getFullYear());

    const topbarConfig = useMemo<TopbarActions>(() => ({
        search: { placeholder: 'Cari siswa...', value: search, onChange: setSearch },
    }), [search]);

    useTopbarActions(topbarConfig);

    const { data: response, isLoading } = useStudentProgressIndex({
        search: debouncedSearch,
        page: currentPage,
        paginate: itemsPerPage,
        month: filterMonth,
        year: filterYear,
    });

    const displayItems = useMemo(() => response?.data ?? [], [response?.data]);

    useEffect(() => { setCurrentPage(1); }, [debouncedSearch, itemsPerPage, filterMonth, filterYear]);

    const columns = useMemo(() => [
        {
            title: 'Siswa', key: 'student_name', sortable: true,
            render: (item: StudentMonthlyProgressEntity) => (
                <div>
                    <div className="font-medium">{item.student_name ?? '-'}</div>
                    {item.parent_name && (
                        <div className="text-xs text-muted-foreground">Ortu: {item.parent_name}</div>
                    )}
                </div>
            ),
        },
        {
            title: 'Kehadiran', key: 'attendance_rate',
            render: (item: StudentMonthlyProgressEntity) => {
                const rate = item.attendance_rate;
                if (rate == null) return <span>-</span>;
                const color = rate >= 80 ? 'text-green-600' : rate >= 60 ? 'text-amber-600' : 'text-red-600';
                return (
                    <span className={`font-medium ${color}`}>
                        {rate.toFixed(0)}%
                        <span className="text-xs text-muted-foreground ml-1">
                            ({item.sessions_attended ?? 0}/{item.sessions_total ?? 0})
                        </span>
                    </span>
                );
            },
        },
        {
            title: 'Rata-rata Skor', key: 'avg_scaled_score',
            render: (item: StudentMonthlyProgressEntity) => {
                const score = item.avg_scaled_score;
                if (score == null) return <span>-</span>;
                const color = score >= 70 ? 'text-green-600' : score >= 50 ? 'text-amber-600' : 'text-red-600';
                return <span className={`font-medium ${color}`}>{score.toFixed(1)}</span>;
            },
        },
        {
            title: 'Tryout', key: 'tryouts_completed',
            render: (item: StudentMonthlyProgressEntity) => <span>{item.tryouts_completed ?? '-'}</span>,
        },
        {
            title: 'Lesson', key: 'lesson_completion_rate',
            render: (item: StudentMonthlyProgressEntity) => {
                const rate = item.lesson_completion_rate;
                if (rate == null) return <span>-</span>;
                return (
                    <span>
                        {rate.toFixed(0)}%
                        <span className="text-xs text-muted-foreground ml-1">
                            ({item.lessons_completed ?? 0}/{item.lessons_total ?? 0})
                        </span>
                    </span>
                );
            },
        },
        {
            title: 'Periode', key: 'period_label',
            render: (item: StudentMonthlyProgressEntity) => <span>{item.period_label ?? '-'}</span>,
        },
        {
            title: '', key: 'expand',
            render: (item: StudentMonthlyProgressEntity) => (
                <Button
                    size="sm" variant="ghost"
                    onClick={() => setExpandedId(expandedId === item.student_id ? null : (item.student_id ?? null))}
                    aria-expanded={expandedId === item.student_id}
                    aria-label={expandedId === item.student_id ? 'Tutup detail' : 'Lihat detail'}
                >
                    {expandedId === item.student_id
                        ? <ChevronUp className="w-4 h-4" />
                        : <ChevronDown className="w-4 h-4" />}
                </Button>
            ),
        },
    ], [expandedId]);

    const expandedItem = displayItems.find(
        (i: StudentMonthlyProgressEntity) => i.student_id === expandedId
    ) ?? null;

    return (
        <div className="p-4 h-full flex flex-col gap-4">
            <div className="flex justify-between items-center flex-wrap gap-2">
                <div>
                    <h1 className="text-xl font-bold tracking-tight">Progres Siswa</h1>
                    <p className="text-muted-foreground text-sm">Monitor perkembangan belajar siswa secara berkala.</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <select
                        className="border rounded px-2 py-1 text-sm bg-background"
                        value={filterMonth}
                        onChange={(e) => setFilterMonth(Number(e.target.value))}
                        aria-label="Filter bulan"
                    >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                            <option key={m} value={m}>
                                {new Date(2000, m - 1).toLocaleString('id-ID', { month: 'long' })}
                            </option>
                        ))}
                    </select>
                    <select
                        className="border rounded px-2 py-1 text-sm bg-background"
                        value={filterYear}
                        onChange={(e) => setFilterYear(Number(e.target.value))}
                        aria-label="Filter tahun"
                    >
                        {Array.from({ length: 5 }, (_, i) => now.getFullYear() - i).map((y) => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                    <StudentProgressCalculateTrigger />
                </div>
            </div>

            <BaseTable columns={columns} data={displayItems} isLoading={isLoading} />

            {expandedId != null && expandedItem != null && (
                <ExpandedDetail
                    studentId={expandedId}
                    studentName={expandedItem.student_name}
                />
            )}

            {(response?.pagination?.total ?? 0) > itemsPerPage && (
                <PaginationWithShow
                    currentPage={currentPage}
                    totalItems={response?.pagination?.total ?? 0}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={(val) => { setItemsPerPage(val); setCurrentPage(1); }}
                />
            )}
        </div>
    );
};

export default StudentProgressMainContent;

