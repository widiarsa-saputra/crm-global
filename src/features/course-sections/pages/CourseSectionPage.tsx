import React from 'react';
import CourseSectionMainContent from '../components/CourseSectionMainContent';
import AdminLayout from '@/layouts/AdminLayout';

const CourseSectionPage: React.FC = () => {
    return (
        <AdminLayout>
            <CourseSectionMainContent />
        </AdminLayout>
    );
};

export default CourseSectionPage;
