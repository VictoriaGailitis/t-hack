import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MainPage from '../../pages/MainPage/MainPage';
import Header from "../../widgets/header/Header";
import ComparePage from "../../pages/ComparePage/ComparePage";

export const AppRoutes: React.FC = () => {
    return (
        <>
            <Header /> {/* Добавьте Header здесь */}
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path='/compare' element={<ComparePage />} />
            </Routes>
        </>
    );
};
