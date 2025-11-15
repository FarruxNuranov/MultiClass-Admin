import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../App/Api/Auth/authSlice";
import getMeReducer from "../App/Api/Auth/getMeSlice";
import tenantsReducer from "../App/Api/tenants/tenantsSlice";
import rolesReducer from "../App/Api/roles/rolesSlice";


const rootReducer = combineReducers({
  auth: authReducer,
  getMe: getMeReducer,
  tenants: tenantsReducer,
  roles:rolesReducer,

});
export default rootReducer;
