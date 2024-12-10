import React from 'react';
import styles from './ConfirmPopup.module.scss';

interface ConfirmPopupProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmPopup: React.FC<ConfirmPopupProps> = ({ message, onConfirm, onCancel }) => {
    // Функция для закрытия попапа при клике вне его
    const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if ((event.target as HTMLElement).classList.contains(styles.overlay)) {
            onCancel();
        }
    };

    return (
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={styles.popup}>
                <p>{message}</p>
                <div className={styles.btns}>
                    <button onClick={onCancel}>Не удалять расчет</button>
                    <button onClick={onConfirm}>Удалить расчет</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmPopup;
