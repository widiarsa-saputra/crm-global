import React, { useEffect } from 'react';
import { Modal } from '@/shared/components/modal/Modal';
import { Button } from '@/components/ui/button';
import { CampaignMutationForm } from './CampaignMutationForm';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateCampaignSchema, UpdateCampaignPayload } from '@/services/campaign/schema/CampaignSchema';
import { useUpdateCampaign } from '@/services/campaign/hooks/useCampaignCRUD';
import { SingleCampaignResponse } from '@/services/campaign';

interface EditCampaignModalProps {
    campaign: SingleCampaignResponse;
    isOpen: boolean;
    onClose: () => void;
}

export const EditCampaignModal: React.FC<EditCampaignModalProps> = ({ campaign, isOpen, onClose }) => {
    const mutation = useUpdateCampaign();

    const form = useForm<UpdateCampaignPayload>({
        resolver: zodResolver(UpdateCampaignSchema),
        defaultValues: {
            campaign_name: campaign.campaign_name || '',
            email_subject: campaign.email_subject || '',
            date: campaign.date || '',
            time: campaign.time || '',
            timezone: campaign.timezone || '',
            message: campaign.message || '',
            target_segment_id: campaign.segment_id ? String(campaign.segment_id) : null,
            campaign_contacts: campaign.campaign_contacts?.map((c) => ({ contact_id: c.contact_id.toString() })) || [],
            status: campaign.status || 'draft',
        },
    });

    useEffect(() => {
        if (isOpen && campaign) {
            form.reset({
                campaign_name: campaign.campaign_name || '',
                email_subject: campaign.email_subject || '',
                date: campaign.date || '',
                time: campaign.time || '',
                timezone: campaign.timezone || '',
                message: campaign.message || '',
                target_segment_id: campaign.segment_id ? String(campaign.segment_id) : null,
                campaign_contacts: campaign.campaign_contacts?.map((c) => ({ contact_id: c.contact_id.toString() })) || [],
                status: campaign.status || 'draft',
            });
        }
    }, [isOpen, campaign, form]);

    const onSubmit = (data: UpdateCampaignPayload) => {
        mutation.mutate({ id: campaign.id, data }, {
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <Modal
            open={isOpen}
            onOpenChange={(open) => !open && onClose()}
            title="Edit Campaign"
            size='2xl'
            description={`Update settings for ${campaign.campaign_name}`}
            footer={
                <div className="flex justify-end gap-2 w-full">
                    <Button type="button" variant="ghost" onClick={onClose} disabled={mutation.isPending}>
                        Cancel
                    </Button>
                    <Button type="submit" form="edit-campaign-form" disabled={mutation.isPending}>
                        {mutation.isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            }
        >
            <CampaignMutationForm
                formId="edit-campaign-form"
                form={form}
                onSubmit={onSubmit}
                mutation={mutation}
                initialSegmentId={campaign.segment_id}
            />
        </Modal>
    );
};
