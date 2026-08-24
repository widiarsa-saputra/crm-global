import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { StudentProgressTrendItem } from '@/services/student-progress';

interface Props {
    data: StudentProgressTrendItem[];
    studentName?: string | null;
}

const ProgressTrendChart: React.FC<Props> = ({ data, studentName }) => {
    const chartData = data.map((item) => ({
        period: item.period_label ?? `${item.period_month}/${item.period_year}`,
        kehadiran: item.attendance_rate != null ? Number(item.attendance_rate.toFixed(1)) : null,
        skor: item.avg_scaled_score != null ? Number(item.avg_scaled_score.toFixed(1)) : null,
        lesson: item.lesson_completion_rate != null ? Number(item.lesson_completion_rate.toFixed(1)) : null,
    }));

    return (
        <div className="w-full">
            <p className="text-sm text-muted-foreground mb-2">
                {studentName ? `Tren progress: ${studentName}` : 'Tren progress per bulan'}
            </p>
            <ResponsiveContainer width="100%" height={280}>
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                        dataKey="period"
                        tick={{ fontSize: 11 }}
                        interval="preserveStartEnd"
                    />
                    <YAxis
                        domain={[0, 100]}
                        tick={{ fontSize: 11 }}
                        tickFormatter={(v) => `${v}%`}
                    />
                    <Tooltip formatter={(value: number) => `${value}%`} />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="kehadiran"
                        name="Kehadiran (%)"
                        stroke="#6366f1"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        connectNulls
                    />
                    <Line
                        type="monotone"
                        dataKey="skor"
                        name="Rata-rata Skor"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        connectNulls
                    />
                    <Line
                        type="monotone"
                        dataKey="lesson"
                        name="Lesson Selesai (%)"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        connectNulls
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ProgressTrendChart;
