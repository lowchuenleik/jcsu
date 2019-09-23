import actionTypes from '../constants/actionTypes';

function usersReceived(user_list){
    return {
        type: actionTypes.USERS_BY_SUBJECT_RECEIVED,
        users: user_list,
        testing_state: "test",
    }
}

function allSubjectsReceived(all_subjs){
    return {
        type: actionTypes.ALL_SUBJECTS_RECEIVED,
        all_subjects: all_subjs
    }
}

export function fetchStudentsOfSubject(subject){
    return dispatch => {
        //This is the URL in the node server API backend
        return fetch(`/subject/students/${subject}`)
        .then( (response) => response.json() )
        //Data is defined in the rest api json thingy.
        .then( (data) => {console.log(data);console.log("in SUBJECT actions ");dispatch(usersReceived(data.data))})
        //Catch is in the case of any errors and whatnot.
        .catch( (e) => {console.log(e);console.log(subject)} );
    }
}

export function getAllSubjects(){
    return dispatch => {
        //This is the URL in the node server API backend
        return fetch(`/subject/`)
        .then( (response) => response.json() )
        //Data is defined in the rest api json thingy.
        .then( (data) => {console.log(data);console.log("in SUBJECT FETCH ALL actions ");dispatch(allSubjectsReceived(data.data))})
        //Catch is in the case of any errors and whatnot.
        .catch( (e) => {console.log(e)} );
    }
}


