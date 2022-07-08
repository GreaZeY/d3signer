import { useThree, useFrame } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { createShapeFromPoints } from "./utils/threeUtils";

// let isDrawing = false;
let timeout = null,
  pointsArr = [];
   var mouse;
const JoinLetters = ({ controls }) => {
  const [isDrawing, setDrawing] = useState(false);
  const [shape, setShape] = useState(null);
  const {
    gl: { domElement },
  } = useThree();
const getPoints = (e)=>{
    console.log(isDrawing);
    if(isDrawing){
    // console.log(e)
    }
}
  useEffect(() => {
    const setIsDrawing = () => {
      controls.current.enabled = isDrawing;
      setDrawing((prev) => !prev);
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

    useEffect(()=>{
        if(!isDrawing){
              console.log('changed',pointsArr);
            let shape = createShapeFromPoints(pointsArr);
        setShape(shape);
        }

    },[isDrawing])

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
        <mesh onUpdate={(g) => console.log(g)} position={[0, 10, 0]}>
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
