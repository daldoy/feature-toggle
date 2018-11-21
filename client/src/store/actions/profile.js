import * as actionTypes from './actionTypes';
import axios from 'axios';

export const profileStart = () => {
	return {
		type: actionTypes.PROFILE_START,
	};
};

export const profileLogout = () => {
	localStorage.removeItem('features');
	return {
		type: actionTypes.PROFILE_LOGOUT,
	};
};

export const profileLoaded = (email, isAdmin, features) => {
	return {
		type: actionTypes.PROFILE_LOADED,
		email: email,
		isAdmin: isAdmin,
		features: features,
	};
};

export const profileLoad = token => {
	return (dispatch, getState) => {
		dispatch(profileStart());
		const url =
			window.location.href.indexOf('heroku') !== -1
				? 'https://feature-toggle.herokuapp.com/'
				: 'http://localhost:8000/';

		if (!token) {
			token = getState().auth.token;
		}

		const email = localStorage.getItem('email');
		axios
			// .get(url + 'features-api/get-my-features/')
			.get(url + 'features-api/get-user-features/', {
				params: { email: email },
				headers: { Authorization: 'Bearer ' + token },
			})
			.then(res => {
				// let isAdmin = false; // TODO CHANGE
				let isAdmin = true;
				let features = '[]';
				if (res.data && res.data.length > 0) {
					if (res.data.includes('admin')) {
						isAdmin = true;
					}
					features = JSON.stringify(res.data);
				}
				localStorage.setItem('features', features);
				dispatch(profileLoaded(email, isAdmin, features));
			})
			.catch(err => {
				console.log('getMyFeatures err');
				console.log(err);
			});
	};
};

export const updateProfile = token => {
	return (dispatch, getState) => {
		const url =
			window.location.href.indexOf('heroku') !== -1
				? 'https://feature-toggle.herokuapp.com/'
				: 'http://localhost:8000/';

		if (!token) {
			token = getState().auth.token;
		}

		const email = localStorage.getItem('email');
		axios
			// .get(url + 'features-api/get-my-features/')
			.get(url + 'features-api/get-user-features/', {
				params: { email: email },
				headers: { Authorization: 'Bearer ' + token },
			})
			.then(res => {
				// let isAdmin = false; // TODO CHANGE
				let isAdmin = true;
				let features = '[]';
				if (res.data && res.data.length > 0) {
					if (res.data.includes('admin')) {
						isAdmin = true;
					}
					features = JSON.stringify(res.data);
				}
				localStorage.setItem('features', features);
				dispatch(profileLoaded(email, isAdmin, features));
			})
			.catch(err => {
				console.log('getMyFeatures err');
				console.log(err);
			});
	};
};
