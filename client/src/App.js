import React, { Component } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import Home from './containers/Home/Home';
import Admin from './containers/Admin/Admin';
import AddFeature from './containers/AddFeature/AddFeature';
import UpdateFeature from './containers/UpdateFeature/UpdateFeature';
import Login from './containers/Login/Login';
import Logout from './containers/Logout/Logout';
import SignUp from './containers/SignUp/SignUp';
import NotFound from './containers/NotFound/NotFound';
import * as authActions from './store/actions/auth';
import * as profileActions from './store/actions/profile';

class App extends Component {
	state = {
		admin: false,
	};

	componentDidMount() {
		this.props.onTryAutoSignup();
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.isAuthenticated && !prevProps.isAuthenticated) {
			this.props.profileLoad(this.props.token);
		}
	}

	render() {
		const { isAuthenticated, loading } = this.props;
		if (isAuthenticated) {
			return (
				<Switch>
					<Route path="/logout" exact component={Logout} />
					<Route path="/admin/update-feature/:id" exact component={UpdateFeature} />
					<Route path="/admin/add-feature" exact component={AddFeature} />
					{this.props.isAdmin && <Route path="/admin" exact component={Admin} />}
					<Route path="/home" exact component={Home} />
					<Redirect path="/" exact to="/home" />
					<Redirect path="/join" exact to="/home" />
					<Redirect path="/login" exact to="/home" />
					{!this.props.loadingProfile && <Route path="*" component={NotFound} />}
				</Switch>
			);
		}
		return (
			<Switch>
				<Route path="/join" exact component={SignUp} />
				<Route path="/login" exact component={Login} />
				{!loading && <Redirect path="*" to="/login" />}
			</Switch>
		);
	}
}

const mapStateToProps = state => ({
	isAuthenticated: state.auth.token !== null,
	token: state.auth.token,
	loading: state.auth.loading,
	isAdmin: state.profile.isAdmin,
	loadingProfile: state.profile.loading,
});

const mapDispatchToProps = dispatch => ({
	onTryAutoSignup: () => dispatch(authActions.authCheckState()),
	profileLoad: token => dispatch(profileActions.profileLoad(token)),
});

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps,
	)(App),
);
