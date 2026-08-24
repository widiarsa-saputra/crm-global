import React from 'react';
import { StudentMonthlyProgressEntity } from '@/services/student-progress';

interface Props {
    item: StudentMonthlyProgressEntity;
}

const StatCard: React.FC<{ label: string; value: React.ReactNode; colorClass?: string }> = ({
    label, value, colorClass = 'text-foreground',
}) => (
    <div className="rounded-lg border bg-card p-4 flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className={`text-2xl font-bold ${colorClass}`}>{value}</span>
    </div>
);

const ProgressStatCards: React.FC<Props> = ({ item }) => {
    const attendanceColor =
        (item.attendance_rate ?? 0) >= 80
            ? 'text-green-600'
            : (item.attendance_rate ?? 0) >= 60
            ? 'text-amber-600'
            : 'text-red-600';

    const scoreColor =
        (item.avg_scaled_score ?? 0) >= 70
            ? 'text-green-600'
            : (item.avg_scaled_score ?? 0) >= 50
            ? 'text-amber-600'
            : 'text-red-600';

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard
                label="Kehadiran"
                value={item.attendance_rate != null ? `${item.attendance_rate.toFixed(0)}%` : '-'}
                colorClass={attendanceColor}
            />
            <StatCard
                label="Sesi Dihadiri"
                value={
                    item.sessions_attended != null && item.sessions_total != null
                        ? `${item.sessions_attended} / ${item.sessions_total}`
                        : '-'
                }
            />
            <StatCard
                label="Rata-rata Skor"
                value={item.avg_scaled_score != null ? item.avg_scaled_score.toFixed(1) : '-'}
                colorClass={scoreColor}
            />
            <StatCard
                label="Skor Terbaik"
                value={item.best_scaled_score != null ? item.best_scaled_score.toFixed(1) : '-'}
                colorClass="text-indigo-600"
            />
            <StatCard
                label="Tryout Selesai"
                value={item.tryouts_completed ?? '-'}
            />
            <StatCard
                label="Peringkat Rata-rata"
                value={item.avg_rank_in_batch != null ? `#${item.avg_rank_in_batch.toFixed(0)}` : '-'}
                colorClass="text-amber-600"
            />
            <StatCard
                label="Lesson Selesai"
                value={
                    item.lessons_completed != null && item.lessons_total != null
                        ? `${item.lessons_completed} / ${item.lessons_total}`
                        : '-'
                }
            />
            <StatCard
                label="Lesson Rate"
                value={
                    item.lesson_completion_rate != null
                        ? `${item.lesson_completion_rate.toFixed(0)}%`
                        : '-'
                }
                colorClass={
                    (item.lesson_completion_rate ?? 0) >= 70 ? 'text-green-600' : 'text-amber-600'
                }
            />
        </div>
    );
};

export default ProgressStatCards;
