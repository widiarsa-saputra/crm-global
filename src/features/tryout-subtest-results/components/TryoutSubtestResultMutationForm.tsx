import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import LabelComp from '@/components/LabelComp';
import { TryoutSubtestResultCreatePayload } from '@/services/tryout-subtest-results';
import { SearchableSelect } from '@/shared/components/form/SearchableSelect';
import { useTryoutAttemptIndex } from '@/services/tryout-attempts';
import { useTryoutSubtestIndex } from '@/services/tryout-subtests';

interface Props {
    form: UseFormReturn<TryoutSubtestResultCreatePayload>;
}

const TryoutSubtestResultMutationForm: React.FC<Props> = ({ form }) => {
    const { setValue, watch, register, formState: { errors } } = form;

    const [attemptSearch, setAttemptSearch] = useState('');
    const { data: attemptResp, isFetching: attemptFetching } = useTryoutAttemptIndex({ search: attemptSearch, paginate: 30 });
    const attemptOptions = (attemptResp?.data ?? []).map(a => ({ label: `Attempt #${a.id} - ${a.student_name ?? 'Unknown'}`, value: String(a.id) }));

    const [subtestSearch, setSubtestSearch] = useState('');
    const { data: subtestResp, isFetching: subtestFetching } = useTryoutSubtestIndex({ search: subtestSearch, paginate: 30 });
    const subtestOptions = (subtestResp?.data ?? []).map(s => ({ label: `Subtest #${s.id} - ${s.title}`, value: String(s.id) }));

    return (
        <form className="flex flex-col gap-4" id="tryout-subtest-result-form">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <LabelComp>Tryout Attempt</LabelComp>
                    <SearchableSelect
                        options={attemptOptions}
                        value={String(watch('tryout_attempt_id') || '')}
                        onChange={(val) => setValue('tryout_attempt_id', val as string, { shouldValidate: true })}
                        onSearchChange={setAttemptSearch}
                        placeholder="Pilih Attempt..."
                        serverSideSearch
                        isPending={attemptFetching}
                    />
                    {errors.tryout_attempt_id && <span className="text-red-500 text-xs">{errors.tryout_attempt_id.message as string}</span>}
                </div>

                <div>
                    <LabelComp>Subtest</LabelComp>
                    <SearchableSelect
                        options={subtestOptions}
                        value={String(watch('subtest_id') || '')}
                        onChange={(val) => setValue('subtest_id', val as string, { shouldValidate: true })}
                        onSearchChange={setSubtestSearch}
                        placeholder="Pilih Subtest..."
                        serverSideSearch
                        isPending={subtestFetching}
                    />
                    {errors.subtest_id && <span className="text-red-500 text-xs">{errors.subtest_id.message as string}</span>}
                </div>
            </div>

            <div className="border-t my-2" />
            <h3 className="font-semibold mb-2">Raw Counts</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                    <LabelComp>Total Answered</LabelComp>
                    <Input type="number" {...register('total_qanswered')} />
                </div>
                <div>
                    <LabelComp>Total Correct</LabelComp>
                    <Input type="number" {...register('total_correct')} />
                </div>
                <div>
                    <LabelComp>Total Wrong</LabelComp>
                    <Input type="number" {...register('total_wrong')} />
                </div>
                <div>
                    <LabelComp>Total Empty</LabelComp>
                    <Input type="number" {...register('total_empty')} />
                </div>
            </div>

            <div className="border-t my-2" />
            <h3 className="font-semibold mb-2">Scores</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                    <LabelComp>Correct Score</LabelComp>
                    <Input type="number" step="0.1" {...register('correct_score')} />
                </div>
                <div>
                    <LabelComp>Wrong Score</LabelComp>
                    <Input type="number" step="0.1" {...register('wrong_score')} />
                </div>
                <div>
                    <LabelComp>Empty Score</LabelComp>
                    <Input type="number" step="0.1" {...register('empty_score')} />
                </div>
                <div>
                    <LabelComp required>Subtest Score</LabelComp>
                    <Input type="number" step="0.1" {...register('subtest_score')} />
                    {errors.subtest_score && <span className="text-red-500 text-xs">{errors.subtest_score.message as string}</span>}
                </div>
            </div>

            <div className="border-t my-2" />
            <h3 className="font-semibold mb-2">IRT Metrics (Opsional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <LabelComp>Theta Score (θ)</LabelComp>
                    <Input type="number" step="0.001" {...register('theta_score')} />
                </div>
                <div>
                    <LabelComp>Standard Error</LabelComp>
                    <Input type="number" step="0.001" {...register('standard_error')} />
                </div>
                <div>
                    <LabelComp>Scaled Error/Score</LabelComp>
                    <Input type="number" step="0.001" {...register('scaled_error')} />
                </div>
            </div>

            <div className="border-t my-2" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                    <LabelComp required>Started At</LabelComp>
                    <Input type="datetime-local" {...register('started_at')} />
                    {errors.started_at && <span className="text-red-500 text-xs">{errors.started_at.message as string}</span>}
                </div>
                <div>
                    <LabelComp>Submitted At</LabelComp>
                    <Input type="datetime-local" {...register('submitted_at')} />
                </div>
                <div className="flex items-center gap-2 pb-2">
                    <input type="checkbox" id="is_passed" {...register('is_passed')} className="h-5 w-5 rounded border-gray-300" />
                    <label htmlFor="is_passed" className="font-medium">Lulus Passing Grade?</label>
                </div>
            </div>
        </form>
    );
};

export default TryoutSubtestResultMutationForm;
