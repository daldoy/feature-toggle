import React from 'react';
import { Link } from 'react-router-dom';

import styles from './Header.module.css';

const NavButton = props => {
	const active = props.isActive ? ` ${styles.ActiveButton}` : '';
	return (
		<Link to={props.to} className={styles.NavButton + active}>
			{props.children}
		</Link>
	);
};

const Header = props => {
	const url = props.url.split('/')[1];

	let buttons = (
		<React.Fragment>
			<div className={styles.NavRow}>
				<NavButton to="/home" isActive={url === 'home'}>
					Home
				</NavButton>
				{props.isAdmin && (
					<NavButton to="/admin" isActive={url === 'admin'}>
						Admin
					</NavButton>
				)}
			</div>
			<Link to="/logout" className={styles.LogoutBtn}>
				Log out
			</Link>
		</React.Fragment>
	);

	if (url === 'login' || url === 'join') {
		const loginBtnActive = url === 'login' ? ` ${styles.ActiveButton}` : '';
		const signUpBtnActive = url === 'join' ? ` ${styles.ActiveButton}` : ` ${styles.SignUpPurple}`;

		buttons = (
			<div className={styles.AuthNavButtonsDiv}>
				<Link to="/login" className={styles.NavButton + loginBtnActive}>
					Login
				</Link>
				<Link to="/join" className={`${styles.NavButton} ${styles.LRMargin}${signUpBtnActive}`}>
					Sign up
				</Link>
			</div>
		);
	}

	return (
		<div className={styles.Header}>
			<div className={styles.HeaderRow}>{buttons}</div>
		</div>
	);
};

export default React.memo(Header);
