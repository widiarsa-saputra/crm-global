import React from 'react';
import PeriodMainContent from '../components/PeriodMainContent';
import AdminLayout from '@/layouts/AdminLayout';

const PeriodPage: React.FC = () => {
    return (
        <AdminLayout>
            <PeriodMainContent />
        </AdminLayout>
    );
};

export default PeriodPage;
