import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import LabelComp from '@/components/LabelComp';
import { TryoutQuestionCreatePayload } from '@/services/tryout-questions';
import { useTryoutSubtestIndex } from '@/services/tryout-subtests';
import { useQuestionBankIndex } from '@/services/question-banks';
import { SearchableSelect } from '@/shared/components/form/SearchableSelect';

interface Props {
    form: UseFormReturn<TryoutQuestionCreatePayload>;
}

const TryoutQuestionMutationForm: React.FC<Props> = ({ form }) => {
    const { register, setValue, watch, formState: { errors } } = form;

    // ── Subtest search state ──────────────────────────────────────────────────
    const [subtestSearch, setSubtestSearch] = useState('');
    const { data: subtestResponse, isFetching: subtestFetching } = useTryoutSubtestIndex({
        search: subtestSearch,
        paginate: 30,
    });
    const subtestOptions = (subtestResponse?.data ?? []).map((t) => ({
        label: t.title ? String(t.title) : String(t.id ?? ''),
        value: String(t.id ?? ''),
    }));

    // ── Question Bank search state ───────────────────────────────────────────
    const [questionSearch, setQuestionSearch] = useState('');
    const { data: questionResponse, isFetching: questionFetching } = useQuestionBankIndex({
        search: questionSearch,
        paginate: 30,
    });
    const questionOptions = (questionResponse?.data ?? []).map((q) => ({
        label: q.question_text
            ? q.question_text.length > 60
                ? q.question_text.slice(0, 60) + '…'
                : q.question_text
            : String(q.id ?? ''),
        value: String(q.id ?? ''),
    }));

    const subtestIdValue = watch('subtest_id');
    const questionIdValue = watch('question_bank_id');

    return (
        <form
            className="flex flex-col gap-4"
            id="tryout-question-form"
        >
            {/* Subtest */}
            <div>
                <LabelComp required>Subtest</LabelComp>
                <SearchableSelect
                    options={subtestOptions}
                    value={subtestIdValue ? String(subtestIdValue) : ''}
                    placeholder="Cari subtest..."
                    onChange={(val) => setValue('subtest_id', val as string, { shouldValidate: true })}
                    onSearchChange={setSubtestSearch}
                    serverSideSearch
                    isPending={subtestFetching}
                />
                {errors.subtest_id && (
                    <span className="text-red-500 text-xs">{errors.subtest_id.message as string}</span>
                )}
            </div>

            {/* Question Bank */}
            <div>
                <LabelComp required>Soal (Question Bank)</LabelComp>
                <SearchableSelect
                    options={questionOptions}
                    value={questionIdValue ? String(questionIdValue) : ''}
                    placeholder="Cari soal..."
                    onChange={(val) => setValue('question_bank_id', val as string, { shouldValidate: true })}
                    onSearchChange={setQuestionSearch}
                    serverSideSearch
                    isPending={questionFetching}
                />
                {errors.question_bank_id && (
                    <span className="text-red-500 text-xs">{errors.question_bank_id.message as string}</span>
                )}
            </div>

            {/* Urutan Soal */}
            <div>
                <LabelComp required>Nomor Urut</LabelComp>
                <Input type="number" {...register('order', { valueAsNumber: true })} />
                {errors.order && (
                    <span className="text-red-500 text-xs">{errors.order.message as string}</span>
                )}
            </div>

            {/* Bobot Skor */}
            <div>
                <LabelComp>Bobot Nilai</LabelComp>
                <Input type="number" step="0.1" {...register('weight_point', { valueAsNumber: true })} />
                {errors.weight_point && (
                    <span className="text-red-500 text-xs">{errors.weight_point.message as string}</span>
                )}
            </div>

            <div className="border-t my-4" />
            <h3 className="font-semibold mb-2">Item Response Theory (IRT) - Kalibrasi Subtes</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <LabelComp>Daya Pembeda (a)</LabelComp>
                    <Input type="number" step="0.01" {...register('item_discrimination_a')} placeholder="e.g. 1.2" />
                    {errors.item_discrimination_a && <span className="text-red-500 text-xs">{errors.item_discrimination_a.message as string}</span>}
                </div>
                <div>
                    <LabelComp>Tingkat Kesulitan (b)</LabelComp>
                    <Input type="number" step="0.01" {...register('item_difficulty_b')} placeholder="e.g. 0.5" />
                    {errors.item_difficulty_b && <span className="text-red-500 text-xs">{errors.item_difficulty_b.message as string}</span>}
                </div>
                <div>
                    <LabelComp>Tebakan (c)</LabelComp>
                    <Input type="number" step="0.01" {...register('item_guessing_c')} placeholder="e.g. 0.2" />
                    {errors.item_guessing_c && <span className="text-red-500 text-xs">{errors.item_guessing_c.message as string}</span>}
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <LabelComp>Sumber Kalibrasi</LabelComp>
                    <select 
                        {...register('calibration_source')}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    >
                        <option value="">-- Pilih --</option>
                        <option value="pre_calibrated">Pre-Calibrated</option>
                        <option value="post_hoc">Post-Hoc</option>
                    </select>
                    {errors.calibration_source && <span className="text-red-500 text-xs">{errors.calibration_source.message as string}</span>}
                </div>
                <div>
                    <LabelComp>Calibrated At</LabelComp>
                    <Input type="datetime-local" {...register('calibrated_at')} />
                    {errors.calibrated_at && <span className="text-red-500 text-xs">{errors.calibrated_at.message as string}</span>}
                </div>
            </div>
        </form>
    );
};

export default TryoutQuestionMutationForm;
