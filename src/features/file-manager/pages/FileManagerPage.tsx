import AdminLayout from '@/layouts/AdminLayout'
import React from 'react'
import FileManagerContent from '../components/FileManagerContent'

const FileManagerPage: React.FC = () => {
    return (
        <AdminLayout>
            <FileManagerContent />
        </AdminLayout>
    )
}

export default FileManagerPage
