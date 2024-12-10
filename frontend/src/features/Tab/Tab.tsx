import React, { useState } from 'react';
import styles from './Tab.module.scss';

interface TabProps {
    tabs: string[];
    onTabChange?: (tab: string) => void;
}

const Tab: React.FC<TabProps> = ({ tabs, onTabChange }) => {
    const [activeTab, setActiveTab] = useState<number>(0);

    const handleTabClick = (index: number, tab: string) => {
        setActiveTab(index);
        if (onTabChange) {
            onTabChange(tab); // Теперь tab - это строка
        }
    };

    return (
        <div className={styles.tabsContainer}>
            <div className={styles.tabs}>
                <div
                    className={styles.indicator}
                    style={{ transform: `translateX(${activeTab * 100}%)`, width: `${100 / tabs.length}%` }} // Передвигаем индикатор
                />
                {tabs.map((tab, index) => (
                    <div
                        key={index}
                        className={`${styles.tab} ${activeTab === index ? styles.active : ''}`}
                        onClick={() => handleTabClick(index, tab)}
                    >
                        {tab}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default React.memo(Tab);
