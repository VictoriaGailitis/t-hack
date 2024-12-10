import React from 'react';
import styles from './Pagination.module.scss';
import classNames from "classnames";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const handlePageClick = (page: number) => {
        onPageChange(page);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    return (
        <div className={styles.pagination}>
            <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={styles.arrowButton}
            >
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
                <button
                    key={index + 1}
                    onClick={() => handlePageClick(index + 1)}
                    className={classNames(currentPage === index + 1 ? styles.active : '',styles.item)}
                >
                    {index + 1}
                </button>
            ))}
            <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={styles.arrowButton}
            >
            </button>
        </div>
    );
};

export default React.memo(Pagination);
