import constants from '../constants/actionTypes'

var initialState = {
    userProfile: {},
    users: [],
    userProfileLoading: true,
    funState: "testinghere"
}

export default (state = initialState, action) => {

  var updated = Object.assign({}, state);

  switch(action.type) {

    case constants.USER_RECEIVED:
      console.log("USER RECEIVED IN USER REDUCER");
      updated['student'] = action.user;
      return updated;

    case constants.ALL_USERS_RECEIVED:
      updated['userProfile'] = action.news;
      updated['userProfileLoading'] = false;
      return updated;

    case constants.USER_LOADING:
      updated['userProfileLoading'] = true;
      return updated;

    default:
      return state;
    }
}