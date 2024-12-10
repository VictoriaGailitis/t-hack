import React from 'react';

import styles from './CompareBudgetItem.module.scss';
import {Budget, setBudget} from "../../entities/OneBudget/OneBudgetSlice";
import Button from "../Button/Button";
import {useAppDispatch} from "../../app/providers/store";
import {setActiveForm} from "../../entities/FormState/FormSlice";
import {useNavigate} from "react-router-dom";
import {cancelBudget} from "../../entities/budgets/budgetsSlice";

const CompareBudgetItem:React.FC<Budget> = ({status,clientsFileKey,id,brand_id,gmv,open_date,purchaseCount,cb_percent,totalCashback}) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleClick =() =>{
        dispatch(setActiveForm(true));
        dispatch(setBudget({id,brand_id,cb_percent,status,clientsFileKey,open_date,gmv,purchaseCount,totalCashback}));
        navigate('/');
    }
    const handleCancelClick =() => {
        dispatch(cancelBudget(id));
    }

    return <div className={styles.compareBudgetItem}>
        <div className={styles.title}>Расчет #{id}</div>
        <div className={styles.top}>
            <div className={styles.item}>
                <div className={styles.subTitle}>ID бренда</div>
                <div className={styles.text}>{brand_id}</div>
            </div>
            <div className={styles.item}>
                <div className={styles.subTitle}>Клиенты</div>
                <div className={styles.text}>{clientsFileKey}</div>
            </div>
            <div className={styles.item}>
                <div className={styles.subTitle}>Дата начала</div>
                <div className={styles.text}>{open_date}</div>
            </div>
            <div className={styles.item}>
                <div className={styles.subTitle}>Процент кэшбэка</div>
                <div className={styles.text}>{cb_percent}%</div>
            </div>
        </div>
        {gmv ?<> <div className={styles.bot}>
            <div className={styles.item}>
                <div className={styles.subTitle}>Потраченная клиентами сумма:</div>
                <div className={styles.text}>{gmv}</div>
            </div>
            <div className={styles.item}>
                <div className={styles.subTitle}>Количество покупок:</div>
                <div className={styles.text}>{purchaseCount}</div>
            </div>
            <div className={styles.item}>
                <div className={styles.subTitle}>Рассчитанный кэшбэк:</div>
                <div className={styles.text}>{totalCashback}</div>
            </div>
        </div>
            <Button title="Дублировать и изменить" onClick={handleClick} /> </> :
            <Button title="Отменить" onClick={handleCancelClick} />}
    </div>
}

export default React.memo(CompareBudgetItem);