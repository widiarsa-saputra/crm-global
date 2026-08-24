import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { TryoutAttemptMainContent } from '@/features/tryout-attempts/components';

const TryoutAttemptPage: React.FC = () => {
    return (
        <AdminLayout>
            <TryoutAttemptMainContent />
        </AdminLayout>
    );
};

export default TryoutAttemptPage;
