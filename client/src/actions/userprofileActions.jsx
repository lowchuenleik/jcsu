import actionTypes from '../constants/actionTypes';

function newsReceived(news){
    return {
        type: actionTypes.NEWS_RECEIVED,
        news: news
    }
}

function newsItemReceived(newsItem){
    console.log("In action function newsitemreceived");
    console.log(newsItem);
    return {
        type: actionTypes.NEWSITEM_RECEIVED,
        news: newsItem,
    }
}

export function submitNewsStory(data){
    return dispatch => {
        return fetch('/news/', {
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

export function fetchUserProfile(){
    return dispatch => {
        return fetch(`/news`)
        .then( (response) => response.json() )
        .then( (data) => dispatch(newsReceived(data.data)))
        .catch( (e) => console.log(e) );
    }
}

export function fetchNewsItem(id){
    return dispatch => {
        return fetch(`/news/${id}`)
        .then( (response) => response.json() )
        .then( (data) => {console.log(data);console.log("in actions ");dispatch(newsItemReceived(data.data))})
        .catch( (e) => {console.log(e);console.log(id)} );
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

function newsItemLoading(){
    return {
        type: actionTypes.NEWSITEM_LOADING
    }
}