import React from 'react';
import TutoringSessionMainContent from '../components/TutoringSessionMainContent';
import AdminLayout from '@/layouts/AdminLayout';

const TutoringSessionPage: React.FC = () => {
    return (
        <AdminLayout>
            <TutoringSessionMainContent />
        </AdminLayout>
    );
};

export default TutoringSessionPage;
