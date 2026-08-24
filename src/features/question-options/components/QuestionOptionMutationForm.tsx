import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import LabelComp from '@/components/LabelComp';
import { QuestionOptionCreatePayload } from '@/services/question-options';
import { useQuestionBankIndex } from '@/services/question-banks';
import { SearchableSelect } from '@/shared/components/form/SearchableSelect';

interface Props {
    form: UseFormReturn<QuestionOptionCreatePayload>;
}

const QuestionOptionMutationForm: React.FC<Props> = ({ form }) => {
    const { setValue, watch, register, formState: { errors } } = form;

    const [questionBankSearch, setQuestionBankSearch] = useState('');
    const { data: qbResp, isFetching: qbFetching } = useQuestionBankIndex({ search: questionBankSearch, paginate: 30 });
    const qbOptions = (qbResp?.data ?? []).map(q => ({ 
        label: q.question_text ? (q.question_text.length > 50 ? q.question_text.substring(0, 50) + '...' : q.question_text) : String(q.id), 
        value: String(q.id) 
    }));

    return (
        <form className="flex flex-col gap-4" id="question-option-form">
            <div>
                <LabelComp required>Soal (Question Bank)</LabelComp>
                <SearchableSelect
                    options={qbOptions}
                    value={String(watch('question_bank_id') || '')}
                    onChange={(val) => setValue('question_bank_id', val as string, { shouldValidate: true })}
                    onSearchChange={setQuestionBankSearch}
                    placeholder="Pilih Soal..."
                    serverSideSearch
                    isPending={qbFetching}
                />
                {errors.question_bank_id && <span className="text-red-500 text-xs">{errors.question_bank_id.message as string}</span>}
            </div>

            <div>
                <LabelComp>Teks Opsi (Option Text)</LabelComp>
                <Textarea {...register('option_text')} rows={4} placeholder="Masukkan teks opsi (opsional, jika bukan PG abaikan)" />
                {errors.option_text && <span className="text-red-500 text-xs">{errors.option_text.message as string}</span>}
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="is_correct"
                    {...register('is_correct')}
                    className="h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor="is_correct" className="text-sm font-medium">Kunci Jawaban Benar?</label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                    <LabelComp>Skor (Score)</LabelComp>
                    <Input type="number" step="0.1" {...register('score')} placeholder="Bobot (jika bukan 1 atau 0)" />
                    {errors.score && <span className="text-red-500 text-xs">{errors.score.message as string}</span>}
                </div>
                <div>
                    <LabelComp>Similarity Boundary</LabelComp>
                    <Input type="number" step="0.01" {...register('similarity_boundary')} placeholder="Batas kemiripan esai otomatis" />
                    {errors.similarity_boundary && <span className="text-red-500 text-xs">{errors.similarity_boundary.message as string}</span>}
                </div>
            </div>
        </form>
    );
};

export default QuestionOptionMutationForm;
