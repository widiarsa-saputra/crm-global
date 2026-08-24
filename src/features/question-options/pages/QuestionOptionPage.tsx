import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { QuestionOptionMainContent } from '@/features/question-options/components';

const QuestionOptionPage: React.FC = () => {
    return (
        <AdminLayout>
            <QuestionOptionMainContent />
        </AdminLayout>
    );
};

export default QuestionOptionPage;
