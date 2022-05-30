import { DESIGN_PROPS_SUCCESS,GENERATING_MODEL,MODEL_GENERATED } from "../constants/designPropsConstants.js";


export const designProps = (props) => async (dispatch) => {
    try {
      // dispatch({ type: GENERATING_MODEL });
      dispatch({ type: DESIGN_PROPS_SUCCESS,payload:props });
      // dispatch({ type: MODEL_GENERATED });
      
    } catch (error) {
      console.log(error)
    //   dispatch({ type: LOGIN_FAIL, payload: error.response.data });
    }
  };