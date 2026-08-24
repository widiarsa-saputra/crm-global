import AdminLayout from '@/layouts/AdminLayout'
import React from 'react'
import RoleUserManagement from '../components/RoleUserManagement'

const RoleUsersAssignedPage: React.FC = () => {
    return (
        <AdminLayout>
            <RoleUserManagement />
        </AdminLayout>
    )
}

export default RoleUsersAssignedPage