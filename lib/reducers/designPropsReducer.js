import {
  GENERATING_MODEL,
  MODEL_GENERATED,
  DESIGN_PROPS_SUCCESS,
  REQUEST_DESIGNS,
  REQUEST_DESIGN_SUCCESS,
  REQUEST_DESIGN_FAILED,
  UPDATE_DESIGN_PROPS_SUCCESS,
} from "../constants/designPropsConstants.js";
import { CLEAR_ERRORS } from "../constants/userConstants.js";
import {
  thicknessBounds,
  lengthBounds,
  letterSpacingBounds,
  stoneSizeBounds,
} from "../constants/pendantDimensionConstants.js";

import { fillArray } from "../utils.js";

const designProps = {
  text: "anya",
  base: "#FFC900",
  length: 4 * lengthBounds.min,
  thickness: thicknessBounds.min,
  font: "Allura",
  bails: [],
  symbols: [],
  symbolSize: 0.5,
  currStoneColor: "",
  currStoneShape: "",
  stoneSize: stoneSizeBounds.min,
  models: [],
};

designProps.letterSpacings = fillArray(
  designProps.text.length,
  letterSpacingBounds.min
);

designProps.lineHeights = fillArray(
  designProps.text.length,
  letterSpacingBounds.min
);

export const designPropsReducer = (
  state = { designs: [], designProps },
  action
) => {
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
        designProps: action.payload,
      };

    case REQUEST_DESIGNS:
      return {
        ...state,
        loading: true,
      };

    case REQUEST_DESIGN_SUCCESS:
      return {
        ...state,
        designs: action.payload.reverse(),
        loading: false,
      };

    case REQUEST_DESIGN_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case UPDATE_DESIGN_PROPS_SUCCESS:
      let { type, obj } = action.payload;
      try {
        switch (type) {
          case "symbols": {
            let updatedSymbols = state.designProps.symbols.map((sym, i) => {
              if (i === obj.userData.index) {
                let { rotation, scale, position } = obj;
                sym.transform = {
                  rotation,
                  scale,
                  position,
                };
              }
              return sym;
            });
            state.designProps[type] = updatedSymbols;
            return state;
          }
        }
      } catch (err) {
        console.log(err);
        return state;
      }

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export { designProps };
