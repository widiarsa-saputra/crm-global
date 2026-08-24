import AdminLayout from '@/layouts/AdminLayout'
import React from 'react'
import ProfilePageContent from '../components/ProfilePageContent'

const ProfilePage: React.FC = () => {
    return (
        <AdminLayout>
            <ProfilePageContent />
        </AdminLayout>
    )
}

export default ProfilePage