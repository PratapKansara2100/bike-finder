import React from 'react';

import styles from './Header.module.scss';

const Header = () => {
    return (
        <div className={styles['App-top']}>
            <h1 className={styles['App-heading']}>
                Locate the nearest participating retailer for the BC Electric Bike RebateProgram
            </h1>
        </div>
    );
};

export default Header;
