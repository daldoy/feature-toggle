import React, { Component } from 'react';
import { connect } from 'react-redux';

import styles from './Home.module.css';
import Header from '../../components/Header/Header';

export class Home extends Component {
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
					{this.props.myFeatures !== '[]' ? (
						<React.Fragment>
							<div>My features:</div>
							<div>{this.props.myFeatures}</div>
						</React.Fragment>
					) : (
						<p>You don't have any feature enabled</p>
					)}
					{!this.props.isAdmin && (
						<React.Fragment>
							<div>If you want to create feature toggles, log in with:</div>
							<p>email: admin</p>
							<p>pwd: admin</p>
						</React.Fragment>
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

export default connect(mapStateToProps)(Home);
