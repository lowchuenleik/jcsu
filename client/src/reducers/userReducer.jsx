import constants from '../constants/actionTypes'

var initialState = {
    userProfile: {},
    users: [],
    userProfileLoading: true,
    funState: "testinghere",
    student:{
      username: "None",
      subject:{name:"No subject",_id:"None"},
      accommodation:{name:"No accom"}
    }
}

export default (state = initialState, action) => {

  var updated = Object.assign({}, state);

  switch(action.type) {

    case constants.USER_RECEIVED:
      updated['student'] = action.user;
      return updated;

    case constants.SUBJECT_RECEIVED:
      updated['subject'] = action.subject;
      return updated;

    case constants.ACCOMMODATION_RECEIVED:
      updated['accommodation'] = action.accommodation;
      return updated;

    case constants.ALL_USERS_RECEIVED:
      updated['all_users'] = action.user_list;
      updated['userProfileLoading'] = false;
      return updated;

    case constants.USER_LOADING:
      updated['userProfileLoading'] = true;
      return updated;

    default:
      return state;
    }
}