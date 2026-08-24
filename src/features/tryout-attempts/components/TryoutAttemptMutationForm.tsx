import React, { useState } from 'react';
import { UseFormReturn, Controller } from 'react-hook-form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import LabelComp from '@/components/LabelComp';
import { TryoutAttemptCreatePayload, AttemptStatusEnum } from '@/services/tryout-attempts';
import { useTryoutIndex } from '@/services/tryouts';
import { useStudentIndex } from '@/services/students';
import { SearchableSelect } from '@/shared/components/form/SearchableSelect';

interface Props {
    form: UseFormReturn<TryoutAttemptCreatePayload>;
}

const STATUS_LABELS: Record<string, string> = {
    in_progress: 'Sedang Dikerjakan',
    completed: 'Selesai',
    abandoned: 'Ditinggalkan',
};

const TryoutAttemptMutationForm: React.FC<Props> = ({ form }) => {
    const { setValue, watch, control, formState: { errors } } = form;

    // ── Tryout search state ──────────────────────────────────────────────────
    const [tryoutSearch, setTryoutSearch] = useState('');
    const { data: tryoutResponse, isFetching: tryoutFetching } = useTryoutIndex({
        search: tryoutSearch,
        paginate: 30,
    });
    const tryoutOptions = (tryoutResponse?.data ?? []).map((t) => ({
        label: t.title ? String(t.title) : String(t.id ?? ''),
        value: String(t.id ?? ''),
    }));

    // ── Student search state ─────────────────────────────────────────────────
    const [studentSearch, setStudentSearch] = useState('');
    const { data: studentResponse, isFetching: studentFetching } = useStudentIndex({
        search: studentSearch,
        paginate: 30,
    });
    const studentOptions = (studentResponse?.data ?? []).map((s) => ({
        label: s.name ? String(s.name) : String(s.id ?? ''),
        value: String(s.id ?? ''),
    }));

    const tryoutIdValue = watch('tryout_id');
    const studentIdValue = watch('student_id');

    return (
        <form className="flex flex-col gap-4" id="tryout-attempt-form">
            {/* Tryout */}
            <div>
                <LabelComp>Tryout</LabelComp>
                <SearchableSelect
                    options={tryoutOptions}
                    value={tryoutIdValue ? String(tryoutIdValue) : ''}
                    placeholder="Cari tryout..."
                    onChange={(val) => setValue('tryout_id', val as string, { shouldValidate: true })}
                    onSearchChange={setTryoutSearch}
                    serverSideSearch
                    isPending={tryoutFetching}
                />
                {errors.tryout_id && (
                    <span className="text-red-500 text-xs">{errors.tryout_id.message as string}</span>
                )}
            </div>

            {/* Siswa */}
            <div>
                <LabelComp>Siswa</LabelComp>
                <SearchableSelect
                    options={studentOptions}
                    value={studentIdValue ? String(studentIdValue) : ''}
                    placeholder="Cari siswa..."
                    onChange={(val) => setValue('student_id', val as string, { shouldValidate: true })}
                    onSearchChange={setStudentSearch}
                    serverSideSearch
                    isPending={studentFetching}
                />
                {errors.student_id && (
                    <span className="text-red-500 text-xs">{errors.student_id.message as string}</span>
                )}
            </div>

            {/* Status */}
            <div>
                <LabelComp required>Status</LabelComp>
                <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih status..." />
                            </SelectTrigger>
                            <SelectContent>
                                {AttemptStatusEnum.map((s) => (
                                    <SelectItem key={s} value={s}>
                                        {STATUS_LABELS[s] ?? s}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.status && (
                    <span className="text-red-500 text-xs">{errors.status.message as string}</span>
                )}
            </div>

            {/* Custom Info (Read Only or Override) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <LabelComp>Tryout Title (Override)</LabelComp>
                    <Input type="text" {...form.register('tryout_title')} placeholder="Kosongkan untuk pakai default" />
                </div>
                <div>
                    <LabelComp>Student Name (Override)</LabelComp>
                    <Input type="text" {...form.register('student_name')} placeholder="Kosongkan untuk pakai default" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <LabelComp>Started At</LabelComp>
                    <Input type="datetime-local" {...form.register('started_at')} />
                </div>
                <div>
                    <LabelComp>Submitted At</LabelComp>
                    <Input type="datetime-local" {...form.register('submitted_at')} />
                </div>
            </div>

            <div className="border-t my-2" />
            <h3 className="font-semibold mb-2">Manual Scores</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                    <LabelComp>Total Score</LabelComp>
                    <Input type="number" step="0.1" {...form.register('total_score')} />
                </div>
                <div>
                    <LabelComp>Total Correct Score</LabelComp>
                    <Input type="number" step="0.1" {...form.register('total_correct_score')} />
                </div>
                <div>
                    <LabelComp>Total Wrong Score</LabelComp>
                    <Input type="number" step="0.1" {...form.register('total_wrong_score')} />
                </div>
                <div>
                    <LabelComp>Total Empty Score</LabelComp>
                    <Input type="number" step="0.1" {...form.register('total_empty_score')} />
                </div>
            </div>

            <p className="text-xs text-muted-foreground border border-border rounded-md p-3 bg-muted/30">
                💡 Input jawaban per soal dapat dilakukan melalui menu <strong>Attempt Answers</strong> setelah attempt dibuat.
            </p>
        </form>
    );
};

export default TryoutAttemptMutationForm;
