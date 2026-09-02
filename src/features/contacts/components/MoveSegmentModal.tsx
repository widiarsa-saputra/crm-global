import React, { useState, useMemo, useEffect } from 'react';
import { Modal } from '@/shared/components/modal/Modal';
import { Button } from '@/components/ui/button';
import { useUpdateContact } from '@/services/contacts/hooks/useContactsCRUD';
import { SingleContactResponse } from '@/services/contacts';
import Combobox from '@/components/Combobox';
import { useIndexSegment } from '@/services/segments';
import { Users } from 'lucide-react';

interface MoveSegmentModalProps {
    contact?: SingleContactResponse | null;
    isOpen: boolean;
    onClose: () => void;
}

export const MoveSegmentModal: React.FC<MoveSegmentModalProps> = ({ contact, isOpen, onClose }) => {
    const { mutate: updateContact, isPending } = useUpdateContact();
    const { data: apiSegments } = useIndexSegment({});
    const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && contact) {
            setSelectedSegmentId(contact.segment_id ? contact.segment_id.toString() : null);
        }
    }, [isOpen, contact]);

    const segmentOptions = useMemo(() => {
        if (!apiSegments?.data) return [];
        return apiSegments.data.map((segment) => ({
            label: segment.name,
            value: segment.id.toString(),
        }));
    }, [apiSegments]);

    const handleConfirm = () => {
        if (!contact) return;
        updateContact({ 
            id: contact?.id ?? '',
            data: { segment_id: selectedSegmentId } 
        }, {
            onSuccess: () => {
                onClose();
            }
        });
    };



    return (
        <Modal
            open={isOpen}
            onOpenChange={(open) => !open && onClose()}
            title="Move to Segment"
            description={`Change segment for ${contact?.nama ?? ''}`}
            footer={
                <div className="flex justify-end gap-2 w-full">
                    <Button type="button" variant="ghost" onClick={onClose} disabled={isPending}>
                        Cancel
                    </Button>
                    <Button type="button" onClick={handleConfirm} disabled={isPending}>
                        {isPending ? 'Moving...' : 'Move Contact'}
                    </Button>
                </div>
            }
        >
            <div className="py-4">
                <Combobox
                    id="move_segment_id"
                    label="Select Target Segment"
                    icon={Users}
                    options={segmentOptions}
                    value={selectedSegmentId}
                    onChange={(option) => setSelectedSegmentId(option.value)}
                />
            </div>
        </Modal>
    );
};
