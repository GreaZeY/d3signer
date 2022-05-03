import { combineReducers } from "redux";
import {userReducer,profileReducer} from "./userReducers";
import {designPropsReducer} from "./designPropsReducer"

export default combineReducers({
  user: userReducer,
  profile:profileReducer,
  designProps:designPropsReducer

});
