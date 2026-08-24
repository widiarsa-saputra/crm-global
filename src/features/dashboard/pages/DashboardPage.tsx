import React from 'react';
import DashboardMainContent from '../components/DashboardMainContent';
import AdminLayout from '@/layouts/AdminLayout';

const DashboardPage: React.FC = () => {
    return (
        <AdminLayout>
            <DashboardMainContent />
        </AdminLayout>
    );
};

export default DashboardPage;
