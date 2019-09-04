import actionTypes from '../constants/actionTypes';

function userReceived(user){
    return {
        type: actionTypes.USER_RECEIVED,
        user: user,
        testing_state: "test",
    }
}

function allUsersReceived(user){
    return {
        type: actionTypes.ALL_USERS_RECEIVED,
        user_list: user
    }
}

//NEEDS WORK TO CREATE USER!
export function submitUser(data){
    return dispatch => {
        return fetch('/user/', {
            method: 'POST',
             headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            body: JSON.stringify(data),
            mode: 'cors'})
            .catch( (e) => console.log(e) );
    }
}

export function fetchAllUsers(){
    return dispatch => {
        return fetch(`/user`)
        .then( (response) => response.json() )
        .then( (data) => dispatch(allUsersReceived(data.data)))
        .catch( (e) => console.log(e) );
    }
}

export function fetchUserProfile(username){
    return dispatch => {
        //This is the URL in the node server API backend
        return fetch(`/student/${username}`)
        .then( (response) => response.json() )
        //Data is defined in the rest api json thingy.
        .then( (data) => {console.log(data);console.log("in actions ");dispatch(userReceived(data.data))})
        //Catch is in the case of any errors and whatnot.
        .catch( (e) => {console.log(e);console.log(username)} );
    }
}

// If we use a different server for our API!
// export function fetchNews(fakeNews){
//     console.log('presend')
//     return dispatch => {
//         return fetch(`http://[INSERT SERVER ADDRESS]/news`, {method: 'GET', mode: 'cors'})
//         .then( (response) =>{
//             console.log(response);
//         });
//     }
// }

function userLoading(){
    return {
        type: actionTypes.USER_LOADING
    }
}