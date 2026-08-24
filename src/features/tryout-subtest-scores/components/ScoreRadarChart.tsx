import React from 'react';
import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import { SubtestBreakdown } from '@/services/tryout-subtest-scores';

interface Props {
    data: SubtestBreakdown[];
    studentName?: string | null;
}

const ScoreRadarChart: React.FC<Props> = ({ data, studentName }) => {
    const chartData = data.map((b) => ({
        subject: b.subtest_name ?? `Subtes ${b.subtest_id}`,
        skor: b.scaled_score ?? 0,
        target: b.passing_grade_target ?? 0,
    }));

    return (
        <div className="w-full">
            <p className="text-sm text-muted-foreground mb-2">
                {studentName ? `Profil skor: ${studentName}` : 'Profil skor per subtes'}
            </p>
            <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={chartData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Radar
                        name="Skor"
                        dataKey="skor"
                        stroke="#6366f1"
                        fill="#6366f1"
                        fillOpacity={0.4}
                    />
                    <Radar
                        name="Target"
                        dataKey="target"
                        stroke="#f59e0b"
                        fill="#f59e0b"
                        fillOpacity={0.15}
                        strokeDasharray="4 4"
                    />
                    <Legend />
                    <Tooltip />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ScoreRadarChart;
