import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from './themeSlice';
import { RootState } from '../../app/providers/store';
import Tab from "../Tab/Tab";
import  styles from './ToogleTheme.module.scss';

const ThemeToggle = () => {
    const dispatch = useDispatch();
    const theme = useSelector((state: RootState) => state.themeSlice.theme);

    const themeAlias = {
        'Светлая':'light',
        'Темная':'dark'
    }

    const handleTabChange = (index: string) => {
        // Изменяем тему в зависимости от индекса выбранного таба
        // Если тема изменилась, обновляем её в Redux
        // @ts-ignore
        if (theme !== themeAlias[index]) {
            dispatch(toggleTheme());
        }
    };

    return (
        <div className={styles.tabsCont}>
            <Tab tabs={['Светлая', 'Темная']} onTabChange={handleTabChange} />
        </div>
    );
};

export default React.memo(ThemeToggle);
