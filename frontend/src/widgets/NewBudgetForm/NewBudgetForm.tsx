import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import styles from './NewBudgetForm.module.scss';
import FileDropZone from "../../features/FileDropZone/FileDropZone";
import {useAppDispatch, useAppSelector} from "../../app/providers/store";
import CompareBudgetItem from "../../features/CompareBudgetItem/CompareBudgetItem";
import Button from "../../features/Button/Button";
import {createBudget} from "../../entities/budgets/budgetsSlice";
import {formatToISO} from "../../shared/utis/date";

export interface FormValues {
    brand_id: string;
    clientsFileKey: string;
    open_date: string;
    cb_percent: number;
}

const NewBudgetForm: React.FC = () => {
    const { register, handleSubmit, setValue, formState: { errors },reset } = useForm<FormValues>();
    const form = useAppSelector((state) => state.formSlice);
    const budget = form.selectedBudget;
    const dispatch = useAppDispatch();

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        const { brand_id,open_date, ...rest } = data; // Если нужно передать clientsFileKey отдельно, обработайте его
        dispatch(createBudget({ ...rest, brand_id:Number(brand_id),open_date:formatToISO(open_date) })); // Передаем данные в createBudget
        reset();
    };

    useEffect(() => {
        if (budget) {
            setValue('brand_id', String(budget.brand_id) || '');
            setValue('clientsFileKey', budget.clientsFileKey || '');
            setValue('open_date', budget.open_date || '');
            setValue('cb_percent', budget.cb_percent || 0);
        }
    }, [budget, setValue]);

    const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, ''); // Удаляем все нечисловые символы
        if (value.length >= 3 && value.length <= 4) {
            value = value.slice(0, 2) + '.' + value.slice(2);
        } else if (value.length >= 5) {
            value = value.slice(0, 2) + '.' + value.slice(2, 4) + '.' + value.slice(4, 8);
        }
        e.target.value = value.slice(0, 10); // Ограничиваем длину до 10 символов
        setValue('open_date', e.target.value as any);
    };

    const handlePercentageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.target.value = e.target.value.replace(/\D/g, ''); // Удаляем все нечисловые символы
        if (e.target.value.length > 3) { // Ограничиваем длину до 3 символов
            e.target.value = e.target.value.slice(0, 3);
        }
        setValue('cb_percent', Number(e.target.value) as any);
    };

    if (!form.activeForm && form.selectedBudget) {
        return <CompareBudgetItem {...form.selectedBudget} />;
    }

    return (
        <div className={styles.newBudgetForm}>
            <div className={styles.Formtitle}>Рассчет бюджета</div>
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.formItem}>
                    <label className={styles.label}>ID бренда</label>
                    <input
                        {...register('brand_id', { required: "Введите ID бренда" })}
                        className={styles.input}
                        placeholder="Введите ID"
                    />
                    {errors.brand_id && <p className={styles.error}>{errors.brand_id.message}</p>}
                </div>
                <div className={styles.formItem}>
                    <label className={styles.label}>Клиенты</label>
                    <input
                        {...register('clientsFileKey')}
                        className={styles.input}
                        placeholder="Вставьте ссылку"
                    />
                    <FileDropZone setValue={setValue} />
                    {errors.clientsFileKey && <p className={styles.error}>{errors.clientsFileKey.message}</p>}
                </div>
                <div className={styles.formItem}>
                    <label className={styles.label}>Дата начала</label>
                    <input
                        {...register('open_date', { required: "Введите дату начала" })}
                        className={styles.input}
                        placeholder="DD.MM.YYYY"
                        maxLength={10}
                        onChange={handleDateInput}
                    />
                    {errors.open_date && <p className={styles.error}>{errors.open_date.message}</p>}
                </div>
                <div className={styles.formItem}>
                    <label className={styles.label}>Процент кэшбэка</label>
                    <input
                        {...register('cb_percent', { required: "Введите процент кэшбэка" })}
                        className={styles.input}
                        placeholder="Введите процент кэшбэка"
                        onChange={handlePercentageInput}
                    />
                    {errors.cb_percent && <p className={styles.error}>{errors.cb_percent.message}</p>}
                </div>
                <div className={styles.btns}>
                    <Button title='Рассчитать' />
                </div>
            </form>
        </div>
    );
};

export default React.memo(NewBudgetForm);
