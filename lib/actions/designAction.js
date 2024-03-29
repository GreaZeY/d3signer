import {
  DESIGN_PROPS_SUCCESS,
  GENERATING_MODEL,
  MODEL_GENERATED,
  REQUEST_DESIGNS,
  REQUEST_DESIGN_FAILED,
  REQUEST_DESIGN_SUCCESS,
  UPDATE_DESIGN_PROPS_SUCCESS,
} from "../constants/designPropsConstants.js";
import axios from "axios";

export const designProps = (props) => async (dispatch) => {
  try {
    // dispatch({ type: GENERATING_MODEL });
    dispatch({ type: DESIGN_PROPS_SUCCESS, payload: props });
    // dispatch({ type: MODEL_GENERATED });
  } catch (error) {
    console.log(error);
  }
};

export const updateDesignProps = (obj, type) => async (dispatch) => {
  try {
    if (!type) type = obj.userData.group;

    dispatch({
      type: UPDATE_DESIGN_PROPS_SUCCESS,
      payload: { type, obj },
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllDesigns = () => async (dispatch) => {
  try {
    dispatch({ type: REQUEST_DESIGNS });
    const { data } = await axios.get(`/api/designs`);

    dispatch({ type: REQUEST_DESIGN_SUCCESS, payload: data.designs });
  } catch (error) {
    console.log(error);
    dispatch({
      type: REQUEST_DESIGN_FAILED,
      payload: error?.response?.data?.message,
    });
  }
};

export const deleteDesigns = (id, alert, onClose) => async (dispatch) => {
  try {
    dispatch({ type: REQUEST_DESIGNS });
    const config = { headers: { "Content-Type": "application/json" }, id };
    const { data } = await axios.delete(`/api/designs?id=${id}`, config);
    if (data.success) {
      dispatch({ type: REQUEST_DESIGN_SUCCESS, payload: data.designs });
      alert.success("Design deleted Succesfully.");
      onClose();
    } else {
      alert.error(data?.message);
    }
  } catch (error) {
    dispatch({
      type: REQUEST_DESIGN_FAILED,
      payload: error?.response?.data?.message,
    });
    alert.error(error?.response?.data?.message);
  }
};

export const saveDesign = (designData) => async (dispatch) => {
  try {
    dispatch({ type: REQUEST_DESIGNS });
    const { data } = await axios.post(`/api/designs`, designData);

    dispatch({ type: REQUEST_DESIGN_SUCCESS, payload: data.designs });
  } catch (error) {
    dispatch({
      type: REQUEST_DESIGN_FAILED,
      payload: error?.response?.data?.message,
    });
  }
};
