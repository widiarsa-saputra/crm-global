import AdminLayout from '@/layouts/AdminLayout'
import React from 'react'
import UserManagementContent from '../components/UserManagementContent'

const UserManagementPage: React.FC = () => {
    return (
        <AdminLayout>
            <UserManagementContent />
        </AdminLayout>
    )
}

export default UserManagementPage