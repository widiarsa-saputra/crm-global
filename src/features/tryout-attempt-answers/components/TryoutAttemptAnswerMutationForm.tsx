import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import LabelComp from '@/components/LabelComp';
import { TryoutAttemptAnswerCreatePayload, GradingStatusEnum } from '@/services/tryout-attempt-answers';
import { SearchableSelect } from '@/shared/components/form/SearchableSelect';
import { useTryoutAttemptIndex } from '@/services/tryout-attempts';
import { useTryoutQuestionIndex } from '@/services/tryout-questions';
import { useQuestionOptionIndex } from '@/services/question-options';

interface Props {
    form: UseFormReturn<TryoutAttemptAnswerCreatePayload>;
}

const TryoutAttemptAnswerMutationForm: React.FC<Props> = ({ form }) => {
    const { setValue, watch, register, formState: { errors } } = form;

    const [attemptSearch, setAttemptSearch] = useState('');
    const { data: attemptResp, isFetching: attemptFetching } = useTryoutAttemptIndex({ search: attemptSearch, paginate: 30 });
    const attemptOptions = (attemptResp?.data ?? []).map(a => ({ label: `Attempt #${a.id} - ${a.student_name ?? 'Unknown'}`, value: String(a.id) }));

    const [questionSearch, setQuestionSearch] = useState('');
    const { data: questionResp, isFetching: questionFetching } = useTryoutQuestionIndex({ search: questionSearch, paginate: 30 });
    const questionOptions = (questionResp?.data ?? []).map(q => ({ label: `Question #${q.id} (Subtest: ${q.subtest_id})`, value: String(q.id) }));

    const [optionSearch, setOptionSearch] = useState('');
    const { data: optionResp, isFetching: optionFetching } = useQuestionOptionIndex({ search: optionSearch, paginate: 30 });
    const optionOptions = (optionResp?.data ?? []).map(o => ({ label: `Option #${o.id} - ${o.option_text ? o.option_text.substring(0,30) : ''}`, value: String(o.id) }));

    return (
        <form className="flex flex-col gap-4" id="tryout-attempt-answer-form">
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
                <LabelComp>Tryout Question</LabelComp>
                <SearchableSelect
                    options={questionOptions}
                    value={String(watch('tryout_question_id') || '')}
                    onChange={(val) => setValue('tryout_question_id', val as string, { shouldValidate: true })}
                    onSearchChange={setQuestionSearch}
                    placeholder="Pilih Soal..."
                    serverSideSearch
                    isPending={questionFetching}
                />
                {errors.tryout_question_id && <span className="text-red-500 text-xs">{errors.tryout_question_id.message as string}</span>}
            </div>

            <div>
                <LabelComp>Question Option (Selected)</LabelComp>
                <SearchableSelect
                    options={optionOptions}
                    value={String(watch('question_option_id') || '')}
                    onChange={(val) => setValue('question_option_id', val as string, { shouldValidate: true })}
                    onSearchChange={setOptionSearch}
                    placeholder="Pilih Opsi (Untuk PG)..."
                    serverSideSearch
                    isPending={optionFetching}
                />
                {errors.question_option_id && <span className="text-red-500 text-xs">{errors.question_option_id.message as string}</span>}
            </div>

            <div className="flex gap-4 items-center">
                <div className="flex items-center gap-2">
                    <input type="checkbox" id="is_correct" {...register('is_correct')} className="h-4 w-4 rounded border-gray-300" />
                    <label htmlFor="is_correct" className="text-sm font-medium">Benar?</label>
                </div>
                <div className="flex items-center gap-2">
                    <input type="checkbox" id="is_flagged" {...register('is_flagged')} className="h-4 w-4 rounded border-gray-300" />
                    <label htmlFor="is_flagged" className="text-sm font-medium">Flagged (Ragu-ragu)</label>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <LabelComp>Score Earned</LabelComp>
                    <Input type="number" step="0.1" {...register('score_earned')} placeholder="Berapa poin?" />
                </div>
                <div>
                    <LabelComp>Response Time (seconds)</LabelComp>
                    <Input type="number" {...register('response_time_seconds')} placeholder="0" />
                </div>
            </div>

            <div>
                <LabelComp>Essay Answer Text</LabelComp>
                <Textarea {...register('essay_answer_text')} rows={4} placeholder="Jika tipe soal esai..." />
            </div>

            <div>
                <LabelComp>Grading Status</LabelComp>
                <select 
                    {...register('grading_status')}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                    <option value="">-- Pilih Status --</option>
                    {GradingStatusEnum.map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
                {errors.grading_status && <span className="text-red-500 text-xs">{errors.grading_status.message as string}</span>}
            </div>
        </form>
    );
};

export default TryoutAttemptAnswerMutationForm;
