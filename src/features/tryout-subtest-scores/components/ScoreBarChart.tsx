import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine,
} from 'recharts';
import { SubtestBreakdown } from '@/services/tryout-subtest-scores';

interface Props {
    data: SubtestBreakdown[];
}

const ScoreBarChart: React.FC<Props> = ({ data }) => {
    const chartData = data.map((b) => ({
        name: b.subtest_name ?? `Subtes ${b.subtest_id}`,
        'Skor Scaled': b.scaled_score ?? 0,
        'Target Lulus': b.passing_grade_target ?? 0,
    }));

    return (
        <div className="w-full">
            <p className="text-sm text-muted-foreground mb-2">Skor per subtes vs target kelulusan</p>
            <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    <ReferenceLine y={60} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Min', fontSize: 10 }} />
                    <Bar dataKey="Skor Scaled" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Target Lulus" fill="#f59e0b" radius={[4, 4, 0, 0]} opacity={0.7} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ScoreBarChart;
