import React, {useEffect, useRef, useState} from 'react';
import styles from './Filter.module.scss';
import classNames from "classnames";
import useClickOutside from "../../shared/hooks/useClickOutside";

const Filter: React.FC<{ filters: number[],onFilterChange: (filter: string) => void }> = ({ filters,onFilterChange }) => {
    const [active, setActive] = useState(false);
    const [filter, setFilter] = useState('Все компании');
    const [search, setSearch] = useState('');
    const [filterList, setFilterList] = useState<string[]>([]);
    const filterRef = useRef<HTMLDivElement>(null);

    useClickOutside(filterRef, () => setActive(false));

    useEffect(() => {
        const filteredFilters = filters
            .map(String) // Преобразуем числа в строки
            .filter((filter) => filter.includes(search));
        setFilterList(filteredFilters);
    }, [filters, search]); // Добавляем зависимость от search

    const handleSetFilter = (string:string) => {
        setFilter(string);
        onFilterChange(string);
        setActive(false);
        setSearch('');
    }

    return (
        <div className={styles.filterfilter} ref={filterRef}>
            <div className={classNames(styles.filter,active && styles.active)} onClick={() => setActive(!active)}>
                {filter}
            </div>
            {active && (
                <div className={styles.filterFind}>
                    <input
                        className={styles.input}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className={styles.filterContent}>
                        {filterList.length > 0 ? (
                            <div className={styles.filterCont}>
                                {filterList.map((filterItem) => (
                                    <div
                                        className={styles.filterItem}
                                        key={filterItem}
                                        onClick={() => {
                                            handleSetFilter(filterItem);
                                        }}
                                    >
                                        {filterItem}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={styles.filterItem} onClick={() => handleSetFilter('Все компании')}>Все компании</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default React.memo(Filter);
