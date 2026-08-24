import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { QuestionBankMainContent } from '@/features/question-banks/components';

const QuestionBankPage: React.FC = () => {
    return (
        <AdminLayout>
            <QuestionBankMainContent />
        </AdminLayout>
    );
};

export default QuestionBankPage;
