import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as authActions from '../../store/actions/auth';
import * as profileActions from '../../store/actions/profile';

import styles from './Logout.module.css';
import Spinner from '../../components/Spinner/Spinner';

class Logout extends Component {
	componentDidMount() {
		this.props.logout();
		this.props.profileLogout();
	}

	render() {
		return (
			<div className={styles.Container}>
				<Spinner />
			</div>
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
		logout: () => dispatch(authActions.logout()),
		profileLogout: () => dispatch(profileActions.profileLogout()),
	};
};

export default connect(
	null,
	mapDispatchToProps,
)(Logout);
