import { DESIGN_PROPS_SUCCESS,DESIGN_PROPS_REQUEST } from "../constants/designPropsConstants";


export const designProps = (props) => async (dispatch) => {
    try {
      dispatch({ type: DESIGN_PROPS_REQUEST });
      dispatch({ type: DESIGN_PROPS_SUCCESS,payload:props });
      
    } catch (error) {
      console.log(error)
    //   dispatch({ type: LOGIN_FAIL, payload: error.response.data });
    }
  };