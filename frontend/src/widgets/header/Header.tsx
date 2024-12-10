import React from 'react';

import styles from './Header.module.scss';
import {Link, useNavigate} from "react-router-dom";
import logo from "../../shared/svg/logo.svg";
import ToogleTheme from "../../features/theme/ToogleTheme";
import SearchPanel from "../../features/SearchPanel/SearchPanel";
import Button from "../../features/Button/Button";
import {useAppDispatch} from "../../app/providers/store";
import {setActiveForm} from "../../entities/FormState/FormSlice";

const Header:React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleCreateBtn = () => {
        dispatch(setActiveForm(true));
        navigate("/");
    }

    return <div className={styles.header}>
        <Link to={'/'} className={styles.logoDiv}>
            <img src={logo} alt='logo'  className={styles.img}/>
            <h1 className={styles.title}>Кэшбэк</h1>
        </Link>
        <SearchPanel />
        <Button title="Cоздать новый расчет" onClick={handleCreateBtn}/>
        <ToogleTheme />
    </div>
}

export default React.memo(Header);