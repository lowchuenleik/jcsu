import constants from '../constants/actionTypes'

var initialState = {
    isAuth: false,
};

export default (state = initialState, action) => {

  var updated = Object.assign({}, state);

  console.log("In RAVEN AUTH ACTION",action);

  switch(action.type) {

    case constants.USER_RAVEN_AUTH:
      updated['authenticated'] = action.authenticated;
      updated['username'] = action.username;
      return updated;

    default:
      return state;
    }
}