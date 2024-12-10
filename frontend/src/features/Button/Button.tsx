import React from 'react';

import styles from './Button.module.scss';

const Button:React.FC<{title:string,onClick?:()=>void}> = ({title,onClick}) => {
    return <button className={styles.btn} onClick={onClick}>
        {title}
    </button>
}

export default React.memo(Button);