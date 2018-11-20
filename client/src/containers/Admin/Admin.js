import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import styles from './Admin.module.css';
import Header from '../../components/Header/Header';
import FeaturesTable from '../../components/FeaturesTable/FeaturesTable';

export class Admin extends Component {
	state = {
		features: [],
	};

	addNewFeature = () => {
		this.props.history.push('/admin/add-feature');
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
					this.setState({ features: res.data });
				}
			})
			.catch(err => {
				console.log('err');
				console.log(err);
			});
	};

	openFeature = idx => {
		const feature = this.state.features[idx];
		this.props.history.push('/admin/update-feature/' + feature._id);
	};

	render() {
		return (
			<React.Fragment>
				<Header isAdmin={this.props.isAdmin} url={this.props.match.url} />
				<div className={styles.Content}>
					<div>Features</div>
					<FeaturesTable featureClicked={this.openFeature} features={this.state.features} />
					<div className={styles.Button} onClick={this.addNewFeature}>
						Add new feature
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

export default connect(mapStateToProps)(Admin);
