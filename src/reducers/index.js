import loginReducer from './logininfo';
import { combineReducers } from 'redux';

const allReducers = combineReducers({
    loginReducer,
});
export default allReducers;