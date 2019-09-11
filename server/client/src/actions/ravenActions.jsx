import actionTypes from '../constants/actionTypes';

export const getProfileFetch = () => {
  return dispatch => {
    const token = localStorage.getItem('token');
    console.log("JUST ENTERED AUTHCHECK",token);
    if (token) {
      return fetch("/auth/raven", {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
        .then(resp => {
            let bb = resp.json();
            // console.log(bb.then((x)=>console.log("JSON DECODED",x)));
            return bb
        })
        .then(data => {
            console.log("DATA IN AUTHCHECK",data);
            if (data.error) {
                // An error will occur if the token is invalid.
                // If this happens, you may want to remove the invalid token.
                localStorage.removeItem("token")
            } else {
                dispatch(userisAuth(true,data.auth.username));
            }
        })
         .catch( (e) => console.log(e) );
    } else{
        dispatch(userisAuth(false,"none"))
    }
  }
}

function userisAuth(auth,username){
    return{
        type: actionTypes.USER_RAVEN_AUTH,
        authenticated: auth,
        username: username,
    }
}