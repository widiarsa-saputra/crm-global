
import React from 'react';
import { Modal } from '@/shared/components/modal/Modal';
import { Button } from '@/components/ui/button';
import { CampaignMutationForm } from './CampaignMutationForm';
import { Resolver, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateCampaignSchema, CreateCampaignPayload } from '@/services/campaign/schema/CampaignSchema';
import { useCreateCampaign } from '@/services/campaign/hooks/useCampaignCRUD';

interface CreateCampaignModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({ isOpen, onClose }) => {
    const mutation = useCreateCampaign();

    const form = useForm<CreateCampaignPayload>({
        resolver: zodResolver(CreateCampaignSchema) as unknown as Resolver<CreateCampaignPayload>,
        defaultValues: {
            campaign_name: '',
            email_subject: '',
            date: '',
            time: '',
            timezone: '',
            template_id: '',
            message: '',
            campaign_contacts: [],
            status: 'draft',
        },
    });

    const onSubmit = (data: CreateCampaignPayload) => {
        mutation.mutate(data, {
            onSuccess: () => {
                form.reset();
                onClose();
            },
        });
    };

    return (
        <Modal
            open={isOpen}
            onOpenChange={(open) => !open && onClose()}
            title="Create New Campaign"
            size='2xl'
            description="Set up a new email campaign to engage with your contacts."
            footer={
                <div className="flex justify-end gap-2 w-full">
                    <Button type="button" variant="ghost" onClick={onClose} disabled={mutation.isPending}>
                        Cancel
                    </Button>
                    <Button type="submit" form="create-campaign-form" disabled={mutation.isPending}>
                        {mutation.isPending ? 'Creating...' : 'Create Campaign'}
                    </Button>
                </div>
            }
        >
            <CampaignMutationForm
                formId="create-campaign-form"
                form={form}
                onSubmit={onSubmit}
                mutation={mutation}
            />
        </Modal>
    );
};
