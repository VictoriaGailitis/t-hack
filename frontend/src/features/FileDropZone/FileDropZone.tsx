import React, { useState, useRef } from 'react';
import styles from './FileDropZone.module.scss';
import { UseFormSetValue } from 'react-hook-form';
import {FormValues} from "../../widgets/NewBudgetForm/NewBudgetForm";

type FileDropZoneProps = {
    setValue: UseFormSetValue<FormValues>;
};

const FileDropZone: React.FC<FileDropZoneProps> = ({ setValue }) => {
    const [fileName, setFileName] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type === 'text/csv') {
                setLoading(true);
                setTimeout(() => {
                    setFileName(file.name);
                    setLoading(false);// Сохраняем файл в данных формы
                }, 2000);
            }
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            if (file.type === 'text/csv') {
                setLoading(true);
                setTimeout(() => {
                    setFileName(file.name);
                    setLoading(false);// Сохраняем файл в данных формы
                }, 2000);
            }
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={handleClick}
            className={styles.filedropzone}
        >
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
                accept=".csv"
            />
            {loading ? (
                <p>Файл загружается...</p>
            ) : !fileName ? (
                <p className={styles.download}><span className={styles.span}>Выберите файлы</span> или перетяните их сюда</p>
            ) : (
                <p className={styles.loaded}>Файл {fileName} загружен</p>
            )}
        </div>
    );
};

export default React.memo(FileDropZone);
