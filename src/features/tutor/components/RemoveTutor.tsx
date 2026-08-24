import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useTutorDelete, TutorEntity } from '../../../services/tutors';
import { toast } from 'sonner';

interface Props {
    tutor: TutorEntity | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const RemoveTutor: React.FC<Props> = ({ tutor, open, onOpenChange }) => {
    const { mutateAsync, isPending } = useTutorDelete();

    const handleDelete = async () => {
        if (!tutor) return;
        try {
            await mutateAsync({ id: tutor.id });
            toast.success("Tutor berhasil dihapus");
            onOpenChange(false);
        } catch {
            toast.error("Gagal menghapus tutor");
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Hapus Tutor?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Apakah Anda yakin ingin menghapus tutor <strong>{tutor?.name}</strong>? Tindakan ini tidak dapat dibatalkan.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            handleDelete();
                        }}
                        disabled={isPending}
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                    >
                        {isPending ? 'Menghapus...' : 'Hapus'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default RemoveTutor;
