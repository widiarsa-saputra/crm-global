import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { TutorMainContent } from '../components';

const TutorPage: React.FC = () => {
    return (
        <AdminLayout>
            <TutorMainContent />
        </AdminLayout>
    );
};

export default TutorPage;
