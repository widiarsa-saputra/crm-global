import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { TryoutAttemptAnswerMainContent } from '@/features/tryout-attempt-answers/components';

const TryoutAttemptAnswerPage: React.FC = () => {
    return (
        <AdminLayout>
            <TryoutAttemptAnswerMainContent />
        </AdminLayout>
    );
};

export default TryoutAttemptAnswerPage;
