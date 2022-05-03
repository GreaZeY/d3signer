import { DESIGN_PROPS_REQUEST, DESIGN_PROPS_SUCCESS } from "../constants/designPropsConstants";

export const designPropsReducer = (state = {}, action) => {
  switch (action.type) {
    case DESIGN_PROPS_REQUEST:
      return {
        ...state,
        loading: true,
      };
     
    case DESIGN_PROPS_SUCCESS:
      return {
        ...state,
        loading: false,
        designProps:action.payload,
      };

      default:
        return state;


  }
};


