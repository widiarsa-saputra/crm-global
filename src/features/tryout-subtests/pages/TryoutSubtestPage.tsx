import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { TryoutSubtestMainContent } from '@/features/tryout-subtests/components';

const TryoutSubtestPage: React.FC = () => (
    <AdminLayout>
        <TryoutSubtestMainContent />
    </AdminLayout>
);

export default TryoutSubtestPage;
