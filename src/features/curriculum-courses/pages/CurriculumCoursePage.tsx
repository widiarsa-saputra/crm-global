import React from 'react';
import CurriculumCourseMainContent from '../components/CurriculumCourseMainContent';
import AdminLayout from '@/layouts/AdminLayout';

const CurriculumCoursePage: React.FC = () => {
    return (
        <AdminLayout>
            <CurriculumCourseMainContent />
        </AdminLayout>
    );
};

export default CurriculumCoursePage;
