import { GENERATING_MODEL,MODEL_GENERATED, DESIGN_PROPS_SUCCESS,REQUEST_DESIGNS ,REQUEST_DESIGN_SUCCESS,REQUEST_DESIGN_FAILED} from "../constants/designPropsConstants.js";
import { CLEAR_ERRORS } from "../constants/userConstants.js";

const designProps=
  {
    text: 'Anya',
    base: '#FFC900',
    length: 20,
    width: 5,
    thickness: 4,
    font: 'Allura',
    bails: [],
    symbol: '',
    currStoneColor: '',
    currStoneShape: '',
    stoneSize:3
  }

export const designPropsReducer = (state = {designs:[],designProps}, action) => {
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

    case REQUEST_DESIGNS:
      return {
        ...state,
       loading:true

      }

    case REQUEST_DESIGN_SUCCESS:
      return {
        ...state,
        designs:action.payload.reverse(),
        loading:false
      }

    case REQUEST_DESIGN_FAILED:
      return {
        ...state,
          loading: false,
          error: action.payload,
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


