import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { TryoutMainContent } from '@/features/tryouts/components';

const TryoutManagementPage: React.FC = () => {
    return (
        <AdminLayout>
            <TryoutMainContent />
        </AdminLayout>
    );
};

export default TryoutManagementPage;
