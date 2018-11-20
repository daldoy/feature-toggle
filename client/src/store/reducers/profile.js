import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
	loading: true,
	email: null,
	isAdmin: null,
	features: localStorage.getItem('features'),
};

const profileStart = state => {
	return updateObject(state, {
		loading: true,
	});
};

const profileLoaded = (state, action) => {
	return updateObject(state, {
		loading: false,
		email: action.email,
		isAdmin: action.isAdmin,
		features: action.features,
	});
};

const profileLogout = (state, action) => {
	return updateObject(state, {
		loading: true,
		email: null,
		isAdmin: null,
		features: '',
	});
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.PROFILE_START:
			return profileStart(state);
		case actionTypes.PROFILE_LOADED:
			return profileLoaded(state, action);
		case actionTypes.PROFILE_LOGOUT:
			return profileLogout(state, action);
		default:
			return state;
	}
};

export default reducer;
