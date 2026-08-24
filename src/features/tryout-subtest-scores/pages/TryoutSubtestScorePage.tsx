import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { TryoutSubtestScoreMainContent } from '@/features/tryout-subtest-scores/components';

const TryoutSubtestScorePage: React.FC = () => (
    <AdminLayout>
        <TryoutSubtestScoreMainContent />
    </AdminLayout>
);

export default TryoutSubtestScorePage;
