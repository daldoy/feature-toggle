import React, { Component } from 'react';
import { connect } from 'react-redux';

import styles from './Home.module.css';
import Header from '../../components/Header/Header';

import * as profileActions from '../../store/actions/profile';

export class Home extends Component {
	componentDidMount() {
		this.props.updateProfile();
	}

	render() {
		if (this.props.loading) {
			return (
				<React.Fragment>
					<Header isAdmin={this.props.isAdmin} url={this.props.match.url} />
				</React.Fragment>
			);
		}
		return (
			<React.Fragment>
				<Header isAdmin={this.props.isAdmin} url={this.props.match.url} />
				<div className={styles.Content}>
					{this.props.myFeatures ? (
						<React.Fragment>
							<div>My features:</div>
							<div>{this.props.myFeatures}</div>
						</React.Fragment>
					) : (
						<div>You don't have any features</div>
					)}
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = state => {
	return {
		myFeatures: state.profile.features,
		isAdmin: state.profile.isAdmin,
		loading: state.profile.loading,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		updateProfile: () => dispatch(profileActions.profileLoad()),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Home);
