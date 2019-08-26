import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import newsReducer from '../reducers/newsReducer';
import authReducer from "../reducers/authReducer";
import userReducer from "../reducers/userReducer";

const store = createStore(
  combineReducers({
      news: newsReducer,
      auth: authReducer,
      user: userReducer
  }),
  applyMiddleware(
      thunk
  )
);

export default store;