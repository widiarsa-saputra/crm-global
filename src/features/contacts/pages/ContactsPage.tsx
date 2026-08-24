import React, { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { SegmentSidebar } from '../components/SegmentSidebar';
import { ContactDirectory } from '../components/ContactDirectory';

const ContactsPage: React.FC = () => {
    const [activeSegmentId, setActiveSegmentId] = useState<string | null>(null);

    return (
        <AdminLayout>
            <div className="flex h-full overflow-hidden w-full bg-background">
                {/* Sidebar untuk Segment Management */}
                <SegmentSidebar 
                    activeSegmentId={activeSegmentId} 
                    onSelectSegment={setActiveSegmentId} 
                />
                
                {/* Area Utama untuk Contact Directory */}
                <ContactDirectory activeSegmentId={activeSegmentId} />
            </div>
        </AdminLayout>
    );
};

export default ContactsPage;
