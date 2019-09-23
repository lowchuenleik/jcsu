import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import ravenReducer from '../reducers/ravenReducer';
import newsReducer from '../reducers/newsReducer';
import authReducer from "../reducers/authReducer";
import userReducer from "../reducers/userReducer";
import subjectReducer from "../reducers/subjectReducer";

const store = createStore(
  combineReducers({
      news: newsReducer,
      auth: authReducer,
      user: userReducer,
      raven: ravenReducer,
      subject: subjectReducer
  }),
  applyMiddleware(
      thunk
  )
);

export default store;