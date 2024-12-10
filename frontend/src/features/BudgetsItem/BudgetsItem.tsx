import React, { useState } from 'react';
import styles from './BudgetsItem.module.scss';
import { deleteBudget } from "../../entities/budgets/budgetsSlice";
import { useAppDispatch, useAppSelector } from "../../app/providers/store";
import { Budget } from "../../entities/OneBudget/OneBudgetSlice";
import ConfirmPopup from '../ConfirmPopup/ConfirmPopup';
import classNames from "classnames";
import { toggleCheckbox } from "../../entities/Compare/CompareSlice";
import { setActiveForm, setSelectedBudget } from "../../entities/FormState/FormSlice";

const BudgetsItem: React.FC<Budget> = ({ id, brand_id, cb_percent, status, clientsFileKey, open_date, gmv, purchaseCount, totalCashback }) => {
    const dispatch = useAppDispatch();
    const selectedBudgets = useAppSelector(state => state.compareSlice.selectedBudgets);
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);
    const isChecked = selectedBudgets.some(budget => budget.id === id); // Проверяем, выбран ли элемент

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation(); // Останавливаем всплытие события
        setShowConfirmPopup(true);
    };

    const confirmDelete = () => {
        dispatch(deleteBudget(id));
        setShowConfirmPopup(false);
    };

    const cancelDelete = () => {
        setShowConfirmPopup(false);
    };

    const handleItemClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        const budget: Budget = { id, brand_id, cb_percent, status, clientsFileKey, open_date, gmv, purchaseCount, totalCashback };
        dispatch(setSelectedBudget(budget));
        dispatch(setActiveForm(false));
    };

    const handleCheckboxClick = (e: React.MouseEvent<HTMLInputElement>): void => {
        e.stopPropagation(); // Останавливаем всплытие события
        const budget: Budget = { id, brand_id, cb_percent, status, clientsFileKey, open_date, gmv, purchaseCount, totalCashback };
        dispatch(toggleCheckbox(budget)); // Передаем весь объект бюджета
    };

    return (
        <div className={styles.budgetsItem} onClick={handleItemClick}>
            <div className={styles.budgetsItemProp}>Расчет #{id}</div>
            <div className={styles.budgetsItemProp}>{brand_id}</div>
            <div className={styles.budgetsItemProp}>{cb_percent}%</div>
            <div className={styles.budgetsItemProp}>{gmv ? gmv : status}</div>
            {status === 'Завершен' && (
                <div className={styles.budgetsItemProp}>
                    <input
                        type="checkbox"
                        className={classNames(styles.checkbox, { [styles.checked]: isChecked })}
                        checked={isChecked}
                        onMouseDown={handleCheckboxClick} // Используем onMouseDown для предотвращения всплытия
                    />
                </div>
            )}
            <button className={styles.cancel} onMouseDown={handleDelete}>
                {/* Добавьте текст или иконку для кнопки удаления */}
            </button>

            {showConfirmPopup && (
                <ConfirmPopup
                    message="Вы уверены, что хотите удалить расчет?"
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}
        </div>
    );
};

export default React.memo(BudgetsItem);
