import React, { useEffect, useState } from 'react';
import styles from './Budgets.module.scss';
import Tab from "../../features/Tab/Tab";
import { useAppDispatch, useAppSelector } from "../../app/providers/store";
import BudgetsItem from "../../features/BudgetsItem/BudgetsItem";
import Pagination from "../../features/Pagination/Pagination";
import sharedStyles from "../../features/BudgetsItem/BudgetsItem.module.scss";
import { getAllBudgets } from "../../entities/budgets/budgetsSlice";
import classNames from "classnames";
import {Link} from "react-router-dom";
import Filter from "../../features/Filter/Filter";

const Budgets: React.FC = () => {
    const dispatch = useAppDispatch();
    const budgets = useAppSelector((state) => state.budgetsSlice.budgets);
    const [activeTab, setActiveTab] = useState<string>('В процессе'); // Установите начальное значение
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [brandFilter, setBrandFilter] = useState<string>('Все компании');
    const itemsPerPage = 11;
    useEffect(() => {
        // @ts-ignore
        dispatch(getAllBudgets());
    }, [dispatch]);
    if (!budgets) {
        return null;
    }
    // Мапируем статусы для фильтрации
    const statusMap: { [key: string]: string } = {
        'В процессе': 'В процессе',
        'Завершенные': 'Завершен'
    };

    // Обновляем фильтрацию на новые статусы
    const filteredBudgets = budgets.filter((el) =>
        el.status === statusMap[activeTab] &&
        (brandFilter === 'Все компании' || el.brand_id === parseInt(brandFilter))
    );
    const totalPages = Math.ceil(filteredBudgets.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredBudgets.slice(startIndex, startIndex + itemsPerPage);
    const uniqueBrandIds = Array.from(new Set(budgets.map((budget) => budget.brand_id)));

    return (
        <div className={styles.budgets}>
            <div className={styles.top}>
                <div className={styles.budgetsTitle}>История расчетов</div>
                <Filter filters={uniqueBrandIds} onFilterChange={setBrandFilter}/>
            </div>
            <Tab tabs={['В процессе', 'Завершенные']} onTabChange={setActiveTab} />
            <div className={styles.budgetsCont}>
                <div className={classNames(sharedStyles.budgetsItem,styles.budgetsit)}>
                    <div className={sharedStyles.budgetsItemProp}>ID расчета</div>
                    <div className={sharedStyles.budgetsItemProp}>ID бренда</div>
                    <div className={sharedStyles.budgetsItemProp}>Кэшбэк</div>
                    {activeTab === "В процессе" ? <div className={sharedStyles.budgetsItemProp}>Время</div> :
                        <div className={sharedStyles.budgetsItemProp}>Сумма покупок</div>}
                    {activeTab === "Завершенные" && <div className={sharedStyles.budgetsItemProp}>Сравнить</div>}
                    <button className={classNames(sharedStyles.cancel,styles.hidden)}></button>
                </div>
                {currentItems.map((el) => (
                    <BudgetsItem
                        key={el.id}
                        id={el.id}
                        status={el.status}
                        brand_id={el.brand_id}
                        cb_percent={el.cb_percent}
                        gmv={el.gmv}
                        purchaseCount={el.purchaseCount}
                        totalCashback={el.totalCashback}
                        open_date={el.open_date}
                    />
                ))}
            </div>
            <div className={styles.pagination}>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>
            {activeTab === "Завершенные" && <Link to={"/compare"} className={styles.compareLink}>Сравнить</Link>}
        </div>
    );
}

export default React.memo(Budgets);
