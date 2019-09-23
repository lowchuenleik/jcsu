import actionTypes from '../constants/actionTypes';

function userLoggedIn(username){
    return {
        type: actionTypes.USER_REGISTERED,
        username: username
    }
}

function userRegistered(username){
    return {
        type: actionTypes.USER_LOGGEDIN,
        username: username
    }
}

function logout(){
    return {
        type: actionTypes.USER_LOGOUT
    }
}


function raven(info){
    return {
        type: actionTypes.USER_RAVEN_AUTH
    }
}

export function submitLogin(data){
    return dispatch => {
        return fetch(`/user/${data.username}`, {
                method: 'POST',
                 headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify(data),
                mode: 'cors'})
            .then( (response) => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response.json();
            })
            .then( (data) => {
                localStorage.setItem('username', data.data.username);
                localStorage.setItem('token', data.data.tokenID);

                dispatch(userLoggedIn(data.data.username));
            })
            .catch( (e) => console.log(e) );
    }
}

export function submitRegister(data){
    return dispatch => {
        return fetch('/user/', {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            mode: 'cors'})
            .then( (response) => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response.json();
            })
            .then( (data) => {

                localStorage.setItem('username', data.data.username);
                localStorage.setItem('token', data.data.tokenID);

                dispatch(userLoggedIn(data.data.username));
            })
            .catch( (e) => console.log(e) );
    }
}

export function logoutUser() {
    return dispatch => {
        localStorage.removeItem('username');
        localStorage.removeItem('token');
        dispatch(logout());
    }
}

export function ravenLogin(){
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const temp = "https://raven.cam.ac.uk/auth/authenticate.html?ver=3&url=http%3A%2F%2Flocalhost%3A5000%2Fravenlogin"
    return dispatch => {
        // return fetch(proxyurl+'http://localhost:3000/ravenlogin', {
        return fetch(proxyurl+temp, {
            method: 'GET',
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }})
            .then( (response) => {
                console.log("RESPONSE",response);
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response.json();
            })
            .then((data)=>{
                console.log("DATA",data);
                // localStorage.setItem("crsid",data.data.crsid);
                localStorage.setItem("crsid",data.hi);
                // dispatch(raven(data.data.crsid))
                dispatch(raven(data.hi))
            })
            .catch((e)=>console.log("ERROR IN RAVEN",e));
    }
}