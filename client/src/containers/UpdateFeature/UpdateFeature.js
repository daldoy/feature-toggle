import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import styles from './UpdateFeature.module.css';
import Header from '../../components/Header/Header';
import SpinnerModal from '../../components/SpinnerModal/SpinnerModal';

export class UpdateFeature extends Component {
	state = {
		name: '',
		isEnabled: '',
		ratio: '',
		spinnerModal: false,
	};

	componentDidMount() {
		this.getAllFeatures();
	}

	getAllFeatures = () => {
		const url = 'http://127.0.0.1:8000/';

		axios
			.get(url + 'features-api/get-all-features/', {
				headers: { Authorization: 'Bearer ' + this.props.token },
			})
			.then(res => {
				if (res.data && res.data.length > 0) {
					for (let feature of res.data) {
						if (feature._id === this.props.match.params.id) {
							const isEnabled = feature.isEnabled ? 'enabled' : 'disabled';
							this.setState({ name: feature.name, isEnabled: isEnabled, ratio: feature.ratio });
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
		this.setState({ [event.target.name]: event.target.value });
	};

	updateFeature = () => {
		this.setState({ spinnerModal: true });
		const url = 'http://127.0.0.1:8000/';

		axios
			.patch(
				url + 'features-api/update-feature/',
				{
					id: this.props.match.params.id,
					name: this.state.name,
					isEnabled: this.state.isEnabled,
					ratio: this.state.ratio,
				},
				{ headers: { Authorization: 'Bearer ' + this.props.token } },
			)
			.then(res => {
				console.log('res');
				console.log(res);
				this.setState({ spinnerModal: false });
			})
			.catch(err => {
				console.log('err');
				console.log(err);
			});
	};

	deleteFeature = () => {
		this.setState({ spinnerModal: true });
		const url = 'http://127.0.0.1:8000/';
		axios
			.delete(url + 'features-api/delete-feature/', {
				data: { id: this.props.match.params.id },
				headers: { Authorization: 'Bearer ' + this.props.token },
			})
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
					<div style={{ paddingBottom: '20px', fontWeight: 'bold' }}>Update a feature</div>
					<div className={styles.Label}>Feature name</div>
					<input readOnly name="name" value={this.state.name} onChange={this.inputChange} />
					<div className={styles.Label}>Status</div>
					<select name="isEnabled" onChange={this.inputChange} value={this.state.isEnabled}>
						<option value={'enabled'}>Enabled</option>
						<option value={'disabled'}>Disabled</option>
					</select>
					<div className={styles.Label}>Ratio of users that will get this feature assigned</div>
					<select name="ratio" value={this.state.ratio} onChange={this.inputChange}>
						{ratiosArray.map(r => (
							<option key={r} value={r}>
								{r} %
							</option>
						))}
					</select>
					<div onClick={this.updateFeature} className={styles.Button}>
						UPDATE FEATURE
					</div>
					<div onClick={this.deleteFeature} className={styles.RemoveButton}>
						DELETE FEATURE
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

export default connect(mapStateToProps)(UpdateFeature);
