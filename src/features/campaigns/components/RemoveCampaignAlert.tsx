import React, { useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useDeleteCampaign, SingleCampaignResponse } from '@/services/campaign';
import { SubmitLoading } from '@/components/SubmitLoading';
import { createPortal } from 'react-dom';

interface RemoveCampaignAlertProps {
    campaign: SingleCampaignResponse;
    isOpen: boolean;
    onClose: () => void;
}

export const RemoveCampaignAlert: React.FC<RemoveCampaignAlertProps> = ({ campaign, isOpen, onClose }) => {
    const mutation = useDeleteCampaign();
    const [isAlertOpen, setIsAlertOpen] = useState(isOpen);

    // Sync state if isOpen changes from parent
    React.useEffect(() => {
        setIsAlertOpen(isOpen);
    }, [isOpen]);

    const handleConfirm = (e: React.MouseEvent) => {
        e.preventDefault();
        mutation.mutate(
            { id: Number(campaign.id) },
            {
                onSuccess: () => {
                    setTimeout(() => {
                        setIsAlertOpen(false);
                        onClose();
                    }, 2000); // matching behavior from RemoveContactAlert
                },
            }
        );
    };

    const handleCancel = () => {
        setIsAlertOpen(false);
        onClose();
    };

    return (
        <>
            <AlertDialog open={isAlertOpen} onOpenChange={(open) => !open && handleCancel()}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the campaign <strong>{campaign.campaign_name}</strong> and remove all its data.
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleCancel} disabled={mutation.isPending}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirm}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? 'Deleting...' : 'Delete Campaign'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            
            {createPortal(
                <div className="z-[100] relative">
                    <SubmitLoading mutation={mutation} />
                </div>,
                document.body
            )}
        </>
    );
};
