
import React, {useEffect} from 'react';
import { AppRoutes } from './providers/routes';
import '../shared/styles/App.scss';
import {useSelector} from "react-redux";
import {RootState} from "./providers/store"; // Глобальные стили

const App:React.FC = () => {
    const {theme} = useSelector((state:RootState) => state.themeSlice);

    useEffect(() => {
        document.body.setAttribute('data-theme', theme);
    },[theme])

    return (
        <div className="app">
            <AppRoutes />
        </div>
    );
};

export default  App
