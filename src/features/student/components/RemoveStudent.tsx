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
import { useStudentDelete, StudentEntity } from '../../../services/students';
import { toast } from 'sonner';

interface Props {
    student: StudentEntity | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const RemoveStudent: React.FC<Props> = ({ student, open, onOpenChange }) => {
    const { mutateAsync, isPending } = useStudentDelete();

    const handleDelete = async () => {
        if (!student) return;
        try {
            await mutateAsync({ id: student.id });
            toast.success("Siswa berhasil dihapus");
            onOpenChange(false);
        } catch {
            toast.error("Gagal menghapus siswa");
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Hapus Siswa?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Apakah Anda yakin ingin menghapus siswa <strong>{student?.name}</strong>? Tindakan ini tidak dapat dibatalkan.
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

export default RemoveStudent;
