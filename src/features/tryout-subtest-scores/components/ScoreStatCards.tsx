import React from 'react';
import { TryoutSubtestScoreEntity } from '@/services/tryout-subtest-scores';

interface Props {
    item: TryoutSubtestScoreEntity;
}

const StatCard: React.FC<{ label: string; value: React.ReactNode; colorClass?: string }> = ({
    label, value, colorClass = 'text-foreground',
}) => (
    <div className="rounded-lg border bg-card p-4 flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className={`text-2xl font-bold ${colorClass}`}>{value}</span>
    </div>
);

const ScoreStatCards: React.FC<Props> = ({ item }) => {
    const totalCorrect = item.subtest_breakdown?.reduce((acc, b) => acc + (b.raw_correct ?? 0), 0) ?? 0;
    const totalQuestions = item.subtest_breakdown?.reduce((acc, b) => acc + (b.total_questions ?? 0), 0) ?? 0;
    const passCount = item.subtest_breakdown?.filter((b) => b.status === 'passed').length ?? 0;
    const totalSubtests = item.subtest_breakdown?.length ?? 0;

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard
                label="Rata-rata Skor"
                value={item.average_scaled_score != null ? item.average_scaled_score.toFixed(1) : '-'}
                colorClass="text-indigo-600"
            />
            <StatCard
                label="Peringkat"
                value={item.rank != null ? `#${item.rank}` : '-'}
                colorClass="text-amber-600"
            />
            <StatCard
                label="Persentil"
                value={item.percentile != null ? `${item.percentile.toFixed(0)}%` : '-'}
            />
            <StatCard
                label="Subtes Lulus"
                value={`${passCount} / ${totalSubtests}`}
                colorClass={passCount === totalSubtests ? 'text-green-600' : 'text-red-600'}
            />
            <StatCard
                label="Jawaban Benar"
                value={`${totalCorrect} / ${totalQuestions}`}
            />
        </div>
    );
};

export default ScoreStatCards;
