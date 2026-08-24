import React from 'react';
import TryoutSubtestResultMainContent from '../components/TryoutSubtestResultMainContent';
import AdminLayout from '@/layouts/AdminLayout';

const TryoutSubtestResultPage: React.FC = () => {
    return (
        <AdminLayout>
            <TryoutSubtestResultMainContent />
        </AdminLayout>
    );
};

export default TryoutSubtestResultPage;
