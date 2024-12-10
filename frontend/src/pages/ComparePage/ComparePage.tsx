import React from "react";

import styles from "./ComparePage.module.scss";
import {useAppSelector} from "../../app/providers/store";
import CompareBudgetItem from "../../features/CompareBudgetItem/CompareBudgetItem";

const ComparePage = () => {
    const compare = useAppSelector((state) => state.compareSlice.selectedBudgets);
    return (
        <div className={styles.page}>
            <div className={styles.contentCont}>
                {compare.length > 0 ? compare.map((el) => <CompareBudgetItem key={el.id} {...el} />) : null}
            </div>
        </div>
    )
}

export default React.memo(ComparePage);