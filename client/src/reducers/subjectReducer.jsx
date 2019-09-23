import constants from '../constants/actionTypes'

var initialState = {
    users: [],
    subject_list: []
}

export default (state = initialState, action) => {

  var updated = Object.assign({}, state);

  switch(action.type) {

      case constants.USERS_BY_SUBJECT_RECEIVED:
          updated['users'] = action.users;
          return updated;

      case constants.ALL_SUBJECTS_RECEIVED:
          updated['subject_list'] = action.all_subjects;
          return updated;

    default:
      return state;
    }
}