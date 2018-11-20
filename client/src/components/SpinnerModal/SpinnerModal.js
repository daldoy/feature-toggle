import React from 'react';
import styles from './SpinnerModal.module.css';

const SpinnerModal = () => {
	return (
		<div className={styles.FullScreen}>
			<div className={styles.spinner}>
				<div className={styles.bounce1} />
				<div className={styles.bounce2} />
				<div className={styles.bounce3} />
			</div>
		</div>
	);
};

export default SpinnerModal;
