import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import styles from './AddFeature.module.css';
import Header from '../../components/Header/Header';

import SpinnerModal from '../../components/SpinnerModal/SpinnerModal';

export class AddFeature extends Component {
	state = {
		name: '',
		isEnabled: 'disabled',
		ratio: '20',
		spinnerModal: false,
	};

	inputChange = event => {
		this.setState({ [event.target.name]: event.target.value });
	};

	createFeature = () => {
		if (this.state.name === '') return;

		this.setState({ spinnerModal: true });
		const url = 'http://127.0.0.1:8000/';

		axios
			.post(
				url + 'features-api/add-feature/',
				{
					name: this.state.name,
					isEnabled: this.state.isEnabled,
					ratio: this.state.ratio,
				},
				{ headers: { Authorization: 'Bearer ' + this.props.token } },
			)
			.then(res => {
				this.setState({ spinnerModal: false });
				this.props.history.push('/admin');
			})
			.catch(err => {
				console.log('err');
				console.log(err);
			});
	};

	render() {
		const ratiosArray = Array.from({ length: 20 }, (v, k) => (k + 1) * 5);
		return (
			<React.Fragment>
				{this.state.spinnerModal && <SpinnerModal />}
				<Header isAdmin={this.props.isAdmin} url={this.props.match.url} />
				<div className={styles.Content}>
					<div style={{ paddingBottom: '20px', fontWeight: 'bold' }}>Create a new feature</div>
					<div className={styles.Label}>Feature name</div>
					<input name="name" onChange={this.inputChange} />
					<div className={styles.Label}>Status</div>
					<select name="isEnabled" onChange={this.inputChange} defaultValue="disabled">
						<option value={'enabled'}>Enabled</option>
						<option value={'disabled'}>Disabled</option>
					</select>
					<div className={styles.Label}>Ratio of users that will get this feature assigned</div>
					<select name="ratio" onChange={this.inputChange} defaultValue="20">
						{ratiosArray.map(r => (
							<option key={r} value={r}>
								{r} %
							</option>
						))}
					</select>
					<div onClick={this.createFeature} className={styles.Button}>
						CREATE FEATURE
					</div>
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = state => {
	return {
		token: state.auth.token,
		isAdmin: state.profile.isAdmin,
	};
};

export default connect(mapStateToProps)(AddFeature);
