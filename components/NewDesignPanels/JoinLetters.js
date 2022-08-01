import { useThree, useFrame } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { createShapeFromPoints } from "./utils/threeUtils";

let pointsArr = [];
let isDrawing = false;

const JoinLetters = ({ controls }) => {
  const [shape, setShape] = useState(null);

  const {
    gl: { domElement },
  } = useThree();

  const getPoints = (e) => {
    if (isDrawing) {
      const x = e.clientX,
        y = e.clientY;
      pointsArr.push({ x, y });
      console.log(x, y);
        let shape = createShapeFromPoints(pointsArr);
        setShape(shape);
        // pointsArr = [];
    }
  };
  useEffect(() => {
    const setIsDrawing = () => {
      controls.current.enabled = isDrawing;
      isDrawing = !isDrawing;
    };
    domElement.addEventListener("pointerdown", setIsDrawing);
    domElement.addEventListener("pointerup", setIsDrawing);
    domElement.addEventListener("pointermove", getPoints);

    return () => {
      domElement.removeEventListener("pointerdown", setIsDrawing);
      domElement.removeEventListener("pointerup", setIsDrawing);
      domElement.removeEventListener("pointermove", getPoints);
    };
  }, []);

  useEffect(() => {
    console.log("effect", isDrawing);
    if (!isDrawing) {
      console.log("changed", pointsArr);
      let shape = createShapeFromPoints(pointsArr);
      setShape(shape);
    }
  }, [isDrawing]);

  useFrame((state) => {
    // if (isDrawing) {
    //     console.log(state);
    // //   pointsArr.push(state.mouse);
    //     // pointsArr = [];
    // }
  });

  const extrudeSettings = {
    depth: 10,
    bevelEnabled: false,
    curveSegments: 10,
    bevelSegments: 30,
    bevelThickness: 10,
    bevelSize: 10,
  };

  return (
    <>
      {shape && (
        <mesh onUpdate={(g) => console.log(g)} scale={[.1,.1,.1]}>
          <extrudeGeometry
            onUpdate={(g) => g.center()}
            args={[shape, extrudeSettings]}
          />
          <meshStandardMaterial color={"red"} metalness={1} roughness={0.2} />
        </mesh>
      )}
    </>
  );
};

export default JoinLetters;
