import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import styles from './UpdateFeature.module.css';
import Header from '../../components/Header/Header';
import SpinnerModal from '../../components/SpinnerModal/SpinnerModal';
import EmailsTable from '../../components/EmailsTable/EmailsTable';

import * as profileActions from '../../store/actions/profile';

export class UpdateFeature extends Component {
	state = {
		name: '',
		isEnabled: '',
		ratio: '',
		specificEmails: [],
		spinnerModal: false,
		changes: false,
	};

	componentDidMount() {
		this.getAllFeatures();
	}

	getAllFeatures = () => {
		const url =
			window.location.href.indexOf('heroku') !== -1
				? 'https://feature-toggle.herokuapp.com/'
				: 'http://localhost:8000/';

		axios
			.get(url + 'features-api/get-all-features/', {
				headers: { Authorization: 'Bearer ' + this.props.token },
			})
			.then(res => {
				if (res.data && res.data.length > 0) {
					for (let feature of res.data) {
						if (feature._id === this.props.match.params.id) {
							const isEnabled = feature.isEnabled ? 'enabled' : 'disabled';
							this.setState({
								name: feature.name,
								isEnabled: isEnabled,
								ratio: feature.ratio,
								specificEmails: feature.specificEmails,
							});
						}
					}
					this.setState({ features: res.data });
				}
			})
			.catch(err => {
				console.log('err');
				console.log(err);
			});
	};

	inputChange = event => {
		this.setState({ [event.target.name]: event.target.value, changes: true });
	};

	updateFeature = () => {
		this.setState({ spinnerModal: true, changes: true });
		const url =
			window.location.href.indexOf('heroku') !== -1
				? 'https://feature-toggle.herokuapp.com/'
				: 'http://localhost:8000/';

		axios
			.patch(
				url + 'features-api/update-feature/',
				{
					id: this.props.match.params.id,
					name: this.state.name,
					isEnabled: this.state.isEnabled,
					ratio: this.state.ratio,
					specificEmails: this.state.specificEmails,
				},
				{ headers: { Authorization: 'Bearer ' + this.props.token } },
			)
			.then(res => {
				console.log('res');
				console.log(res);
				this.setState({ spinnerModal: false, changes: false });
				this.props.updateProfile();
			})
			.catch(err => {
				console.log('err');
				console.log(err);
			});
	};

	deleteFeature = () => {
		this.setState({ spinnerModal: true, changes: true });
		const url =
			window.location.href.indexOf('heroku') !== -1
				? 'https://feature-toggle.herokuapp.com/'
				: 'http://localhost:8000/';
		axios
			.delete(url + 'features-api/delete-feature/', {
				data: { id: this.props.match.params.id },
				headers: { Authorization: 'Bearer ' + this.props.token },
			})
			.then(res => {
				this.setState({ spinnerModal: false });
				this.props.history.push('/admin');
				this.props.updateProfile();
			})
			.catch(err => {
				console.log('err');
				console.log(err);
			});
	};

	addEmail = newEmail => {
		const emails = [...this.state.specificEmails];
		emails.push(newEmail);
		this.setState({ specificEmails: emails, changes: true });
	};

	removeEmail = email => {
		const emails = [...this.state.specificEmails];
		const idx = emails.indexOf(email);
		if (idx !== -1) {
			emails.splice(idx, 1);
		}
		this.setState({ specificEmails: emails, changes: true });
	};

	render() {
		if (this.state.name === '') {
			return (
				<React.Fragment>
					<Header isAdmin={this.props.isAdmin} url={this.props.match.url} />
					<SpinnerModal />
				</React.Fragment>
			);
		}
		const ratiosArray = Array.from({ length: 21 }, (v, k) => k * 5);
		return (
			<React.Fragment>
				{this.state.spinnerModal && <SpinnerModal />}
				<Header isAdmin={this.props.isAdmin} url={this.props.match.url} />
				<div className={styles.Content}>
					<div style={{ fontWeight: 'bold' }}>Update feature</div>
					<div className={styles.Label}>Feature name</div>
					<div> &emsp; {this.state.name}</div>
					{this.state.name !== 'admin' && this.state.name !== '' && (
						<React.Fragment>
							<div className={styles.Label}>Status</div>
							<select name="isEnabled" onChange={this.inputChange} value={this.state.isEnabled}>
								<option value={'disabled'}>Disabled</option>
								<option value={'enabled'}>Enabled</option>
							</select>
							<div className={styles.Label}>Ratio of users that will get this feature assigned</div>
							<select name="ratio" value={this.state.ratio} onChange={this.inputChange}>
								{ratiosArray.map(r => (
									<option key={r} value={r}>
										{r} %
									</option>
								))}
							</select>
						</React.Fragment>
					)}
					<div className={styles.Label}>Specific users that will have this feature enabled</div>
					<EmailsTable
						removeEmail={this.removeEmail}
						addEmail={this.addEmail}
						emails={this.state.specificEmails}
					/>
					{this.state.changes && (
						<div onClick={this.updateFeature} className={styles.Button}>
							UPDATE FEATURE
						</div>
					)}

					{this.state.name !== 'admin' && (
						<div onClick={this.deleteFeature} className={styles.RemoveButton}>
							DELETE FEATURE
						</div>
					)}
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
)(UpdateFeature);
