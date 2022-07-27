import { useRef, useEffect, useState, useMemo } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

import { useSelector, useDispatch } from "react-redux";

import { createText } from "./utils/threeUtils";

const PendantFromCanvas = () => {
  const dispatch = useDispatch();
  const { designProps: currDesign } = useSelector((state) => state.designProps);

  const [shape, setShape] = useState([])
   
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

useEffect(async () => {
  setShape(await createText(currDesign));
}, [text, length]);
 console.log(shape);


      const extrudeSettings = {
        depth: 2,
        bevelEnabled: false,
        curveSegments: 10,
        bevelSegments: 3,
        bevelThickness: 1,
        bevelSize: 1,
      };

  return (
    <>
      {shape.length && (
        <mesh
          onUpdate={(o) => {
            var box = new THREE.Box3();
            box.setFromObject(o);
            console.log(box);
          }}
          scale={-0.03 * length}
          rotation-y={Math.PI}
        >
          <extrudeGeometry
            onUpdate={(g) => {
              g.center();
              g.computeBoundingBox();
              console.log(g.boundingBox);
            }}
            args={[shape, extrudeSettings]}
          />
          <meshStandardMaterial color={base} metalness={1} roughness={0.2} />
        </mesh>
      )}
    </>
  );
};

export default PendantFromCanvas;
