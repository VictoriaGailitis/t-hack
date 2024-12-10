import React, {useEffect, useRef} from "react";
import styles from './SearchPanel.module.scss';
import { useSelector } from "react-redux";
import {RootState, useAppDispatch} from "../../app/providers/store";
import { Link } from "react-router-dom";
import { Budget } from "../../entities/budgets/budgetsSlice";
import useClickOutside from "../../shared/hooks/useClickOutside";
import {setActiveForm, setSelectedBudget} from "../../entities/FormState/FormSlice"; // Убедитесь, что путь правильный

const SearchPanel: React.FC = () => {
    const [search, setSearch] = React.useState('');
    const [searchBudgets, setSearchBudgets] = React.useState<Budget[]>([]); // Указываем тип здесь
    const budgets = useSelector((state: RootState) => state.budgetsSlice.budgets);
    const dispatch = useAppDispatch();

    const searchRef = useRef<HTMLDivElement>(null);

    useClickOutside(searchRef, () => setSearchBudgets([]));
    useEffect(() => {
        if (search.length > 0 && budgets) {
            const filteredBudgets = budgets.filter((el) =>
                el.id.toString().includes(search)
            ).slice(0, 4); // Ограничиваем количество элементов до 4
            setSearchBudgets(filteredBudgets);
        } else {
            setSearchBudgets([]);
        }
    }, [search, budgets]);

    const handleClick = (el:Budget) => {
        setSearchBudgets([]);
        setSearch('');
        dispatch(setSelectedBudget(el));
        dispatch(setActiveForm(false));
    }

    return (
        <div className={styles.search} ref={searchRef}>
            <input
                className={styles.searchPanel}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск по ID"
            />
            {searchBudgets.length > 0 && <div className={styles.searchItems}>
                {searchBudgets.map((el) => (
                    <div key={el.id} className={styles.searchItem} onClick={() => handleClick(el)}>
                        {`Расчет #${el.id}  ${el.brand_id} ${el.cb_percent}% ${el.status}`}
                    </div>
                ))}
            </div>}
        </div>
    );
}

export default React.memo(SearchPanel);
