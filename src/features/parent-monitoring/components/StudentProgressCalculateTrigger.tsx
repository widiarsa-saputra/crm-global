import React, { useState } from 'react';
import { Modal } from '@/shared/components/modal/Modal';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    StudentProgressCalculateSchema,
    StudentProgressCalculatePayload,
    useStudentProgressCalculate,
} from '@/services/student-progress';
import LabelComp from '@/components/LabelComp';
import { Input } from '@/components/ui/input';

const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH = new Date().getMonth() + 1;

const StudentProgressCalculateTrigger: React.FC = () => {
    const [open, setOpen] = useState(false);
    const mutation = useStudentProgressCalculate();

    const form = useForm<StudentProgressCalculatePayload>({
        resolver: zodResolver(StudentProgressCalculateSchema),
        defaultValues: {
            month: CURRENT_MONTH,
            year: CURRENT_YEAR,
        },
    });

    const handleSubmit = async (data: StudentProgressCalculatePayload) => {
        await mutation.mutateAsync(data);
        setOpen(false);
    };

    return (
        <Modal
            open={open}
            onOpenChange={setOpen}
            title="Hitung Progress Bulanan"
            trigger={
                <Button size="sm" variant="outline">
                    <RefreshCw className="w-4 h-4 mr-1" /> Hitung Progress
                </Button>
            }
            footer={
                <div className="flex justify-end gap-2 w-full">
                    <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
                    <Button
                        disabled={mutation.isPending}
                        form="progress-calculate-form"
                        type="submit"
                    >
                        {mutation.isPending ? 'Memproses...' : 'Jalankan'}
                    </Button>
                </div>
            }
        >
            <form
                id="progress-calculate-form"
                className="flex flex-col gap-4"
                onSubmit={e => { e.preventDefault(); form.handleSubmit(handleSubmit)(); }}
            >
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <LabelComp required>Bulan</LabelComp>
                        <Input
                            type="number"
                            min={1}
                            max={12}
                            {...form.register('month', { valueAsNumber: true })}
                        />
                        {form.formState.errors.month && (
                            <span className="text-red-500 text-xs">
                                {form.formState.errors.month.message as string}
                            </span>
                        )}
                    </div>
                    <div>
                        <LabelComp required>Tahun</LabelComp>
                        <Input
                            type="number"
                            min={2020}
                            {...form.register('year', { valueAsNumber: true })}
                        />
                        {form.formState.errors.year && (
                            <span className="text-red-500 text-xs">
                                {form.formState.errors.year.message as string}
                            </span>
                        )}
                    </div>
                </div>
                <p className="text-sm text-muted-foreground">
                    Kalkulasi akan merangkum data kehadiran, tryout, dan lesson completion seluruh
                    siswa untuk periode yang dipilih. Proses berjalan di background.
                </p>
            </form>
        </Modal>
    );
};

export default StudentProgressCalculateTrigger;
