import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../App/Api/Auth/authSlice";
import getMeReducer from "../App/Api/Auth/getMeSlice";


const rootReducer = combineReducers({
  auth: authReducer,
  getMe: getMeReducer,

});
export default rootReducer;
