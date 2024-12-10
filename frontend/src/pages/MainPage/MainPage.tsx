import React from 'react';

import styles from './MainPage.module.scss';
import NewBudgetForm from "../../widgets/NewBudgetForm/NewBudgetForm";
import Budgets from "../../widgets/Budgets/Budgets";

const MainPage:React.FC = () => {
    return <div className={styles.page}>
        <NewBudgetForm />
        <Budgets />
    </div>
}

export default React.memo(MainPage);