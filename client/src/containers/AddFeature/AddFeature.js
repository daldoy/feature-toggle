import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import styles from './AddFeature.module.css';
import Header from '../../components/Header/Header';
import SpinnerModal from '../../components/SpinnerModal/SpinnerModal';
import EmailsTable from '../../components/EmailsTable/EmailsTable';

import * as profileActions from '../../store/actions/profile';

export class AddFeature extends Component {
	state = {
		name: '',
		isEnabled: 'disabled',
		ratio: '0',
		specificEmails: [],
		spinnerModal: false,
	};

	inputChange = event => {
		this.setState({ [event.target.name]: event.target.value });
	};

	createFeature = () => {
		if (this.state.name === '') return;

		this.setState({ spinnerModal: true });
		const url =
			window.location.href.indexOf('heroku') !== -1
				? 'https://feature-toggle.herokuapp.com/'
				: 'http://localhost:8000/';

		axios
			.post(
				url + 'features-api/add-feature/',
				{
					name: this.state.name,
					isEnabled: this.state.isEnabled,
					ratio: this.state.ratio,
					specificEmails: this.state.specificEmails,
				},
				{ headers: { Authorization: 'Bearer ' + this.props.token } },
			)
			.then(res => {
				this.setState({ spinnerModal: false });
				this.props.updateProfile();
				this.props.history.push('/admin');
			})
			.catch(err => {
				console.log('err');
				console.log(err);
			});
	};

	addEmail = newEmail => {
		const emails = [...this.state.specificEmails];
		if (!emails.includes(newEmail)) {
			emails.push(newEmail);
			this.setState({ specificEmails: emails });
		}
	};

	removeEmail = email => {
		const emails = [...this.state.specificEmails];
		const idx = emails.indexOf(email);
		if (idx !== -1) {
			emails.splice(idx, 1);
		}
		this.setState({ specificEmails: emails });
	};

	render() {
		const ratiosArray = Array.from({ length: 21 }, (v, k) => k * 5);
		return (
			<React.Fragment>
				{this.state.spinnerModal && <SpinnerModal />}
				<Header isAdmin={this.props.isAdmin} url={this.props.match.url} />
				<div className={styles.Content}>
					<div style={{ paddingBottom: '20px', fontWeight: 'bold' }}>Create a new feature</div>
					<div className={styles.Label}>Feature name</div>
					<input className={styles.Input} name="name" onChange={this.inputChange} />
					<div className={styles.Label}>Status</div>
					<select name="isEnabled" onChange={this.inputChange} defaultValue="disabled">
						<option value={'disabled'}>Disabled</option>
						<option value={'enabled'}>Enabled</option>
					</select>
					<div className={styles.Label}>Ratio of users that will have this feature enabled</div>
					<select name="ratio" onChange={this.inputChange}>
						{ratiosArray.map(r => (
							<option key={r} value={r}>
								{r} %
							</option>
						))}
					</select>
					<div className={styles.Label}>Specific users that will have this feature enabled</div>
					<EmailsTable
						removeEmail={this.removeEmail}
						addEmail={this.addEmail}
						emails={this.state.specificEmails}
					/>
					<div onClick={this.createFeature} className={styles.Button}>
						Create
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

const mapDispatchToProps = dispatch => {
	return {
		updateProfile: () => dispatch(profileActions.updateProfile()),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(AddFeature);
