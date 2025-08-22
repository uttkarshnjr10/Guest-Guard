import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styles from './ProfileSkeletonLoader.module.css';

const ProfileSkeletonLoader = () => {
  return (
    <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
      <div className={styles.skeletonProfile}>
        <div className={styles.header}>
          <Skeleton circle={true} height={100} width={100} />
          <div className={styles.headerInfo}>
            <Skeleton height={30} width={200} />
            <Skeleton height={20} width={150} />
          </div>
        </div>
        <div className={styles.details}>
          <div className={styles.detailItem}>
            <Skeleton height={20} width={100} />
            <Skeleton height={20} width={250} />
          </div>
          <div className={styles.detailItem}>
            <Skeleton height={20} width={100} />
            <Skeleton height={20} width={250} />
          </div>
          <div className={styles.detailItem}>
            <Skeleton height={20} width={100} />
            <Skeleton height={20} width={250} />
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default ProfileSkeletonLoader;