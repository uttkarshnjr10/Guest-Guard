import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import styles from './TableSkeletonLoader.module.css';

// You can customize the number of rows and columns via props
const TableSkeletonLoader = ({ rows = 5, columns = 6 }) => {
  return (
    <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
      <div className={styles.skeletonTable}>
        {/* Skeleton for Table Header */}
        <div className={styles.skeletonRow} style={{ fontWeight: 'bold' }}>
          {Array(columns).fill(0).map((_, index) => (
            <div key={index} className={styles.skeletonCell}><Skeleton height={20} /></div>
          ))}
        </div>
        
        {/* Skeleton for Table Body */}
        {Array(rows).fill(0).map((_, rowIndex) => (
          <div key={rowIndex} className={styles.skeletonRow}>
            {Array(columns).fill(0).map((_, colIndex) => (
              <div key={colIndex} className={styles.skeletonCell}><Skeleton height={20} /></div>
            ))}
          </div>
        ))}
      </div>
    </SkeletonTheme>
  );
};

export default TableSkeletonLoader;