import React from 'react';

import styles from './FeaturesTable.module.css';

const FeaturesTable = props => (
	<div className={styles.FeaturesTable}>
		<div className={styles.RowWrapper}>
			<div className={styles.FeatureRow}>
				<div className={styles.Column}>Name</div>
				<div className={styles.Column}>Status</div>
				<div className={styles.Column}>Ratio</div>
			</div>
		</div>

		{props.features.map((f, idx) => (
			<div key={idx} className={styles.RowWrapper}>
				<div onClick={() => props.featureClicked(idx)} className={styles.Row}>
					<div className={styles.Column}>{f.name}</div>
					<div className={styles.Column}>{f.isEnabled ? 'ENABLED' : 'Disabled'}</div>
					<div className={styles.Column}>{f.ratio}</div>
				</div>
			</div>
		))}
		{props.children}
	</div>
);

export default FeaturesTable;
