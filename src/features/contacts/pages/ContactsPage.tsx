import React, { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { SegmentSidebar } from '../components/SegmentSidebar';
import { ContactDirectory } from '../components/ContactDirectory';

const ContactsPage: React.FC = () => {
    const [activeSegmentId, setActiveSegmentId] = useState<string | null>(null);
    const [totalContacts, setTotalContacts] = useState(0);

    return (
        <AdminLayout>
            <div className="flex h-full overflow-hidden w-full">
                {/* Sidebar untuk Segment Management */}
                <SegmentSidebar 
                    activeSegmentId={activeSegmentId} 
                    onSelectSegment={setActiveSegmentId} 
                    totalContacts={totalContacts}
                />
                
                {/* Area Utama untuk Contact Directory */}
                <ContactDirectory activeSegmentId={activeSegmentId} setTotalContacts={setTotalContacts} />
            </div>
        </AdminLayout>
    );
};

export default ContactsPage;
