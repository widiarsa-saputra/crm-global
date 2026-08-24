import React from 'react';
import PeriodEnrollmentMainContent from '../components/PeriodEnrollmentMainContent';
import AdminLayout from '@/layouts/AdminLayout';

const PeriodEnrollmentPage: React.FC = () => {
    return (
        <AdminLayout>
            <PeriodEnrollmentMainContent />
        </AdminLayout>
    );
};

export default PeriodEnrollmentPage;
