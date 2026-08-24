import React from 'react';
import AssignTryoutMainContent from '../components/AssignTryoutMainContent';
import AdminLayout from '@/layouts/AdminLayout';

const AssignTryoutPage: React.FC = () => {
    return (
        <AdminLayout>
            <AssignTryoutMainContent />
        </AdminLayout>
    );
};

export default AssignTryoutPage;
