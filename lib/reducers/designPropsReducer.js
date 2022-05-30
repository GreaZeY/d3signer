import { GENERATING_MODEL,MODEL_GENERATED, DESIGN_PROPS_SUCCESS } from "../constants/designPropsConstants.js";

export const designPropsReducer = (state = {}, action) => {
  switch (action.type) {
    case GENERATING_MODEL:
      return {
        ...state,
        loading: true,
      };

    case MODEL_GENERATED:
      return {
        ...state,
        loading: false,
      };
     
    case DESIGN_PROPS_SUCCESS:
      return {
        ...state,
        designProps:action.payload,
      };

      default:
        return state;


  }
};


