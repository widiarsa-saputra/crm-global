import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { TryoutQuestionMainContent } from '@/features/tryout-questions/components';

const TryoutQuestionPage: React.FC = () => {
    return (
        <AdminLayout>
            <TryoutQuestionMainContent />
        </AdminLayout>
    );
};

export default TryoutQuestionPage;
