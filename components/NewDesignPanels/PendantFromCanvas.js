import { useRef, useEffect, useState, useMemo } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

import { useSelector, useDispatch } from "react-redux";

import {
 createText
} from "./utils/threeUtils";


const PendantFromCanvas = () => {

  const dispatch = useDispatch()
    const { designProps: currDesign } = useSelector(
      (state) => state.designProps
    );
    const {
      text,
      base,
      length,
      thickness,
      font: currFont,
      currStoneColor,
      currStoneShape,
      stoneSize,
    } = currDesign;

    useEffect(() => {
      dispatch(createText(currDesign));
    }, [text]);

  return <></>;
};

export default PendantFromCanvas;
