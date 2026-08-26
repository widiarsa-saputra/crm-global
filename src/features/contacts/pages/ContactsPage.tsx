import React, { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { SegmentSidebar } from '../components/SegmentSidebar';
import { ContactDirectory } from '../components/ContactDirectory';

const ContactsPage: React.FC = () => {
    const [activeSegmentId, setActiveSegmentId] = useState<string | null>(null);

    return (
        <AdminLayout>
            <div className="flex h-full overflow-hidden w-full">
                <SegmentSidebar 
                    activeSegmentId={activeSegmentId} 
                    onSelectSegment={setActiveSegmentId} 
                />
                
                <ContactDirectory activeSegmentId={activeSegmentId} />
            </div>
        </AdminLayout>
    );
};

export default ContactsPage;
