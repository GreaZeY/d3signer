import { useMemo } from "react";
import { loadBail } from "../utils/threeUtils";

const Bail = (props) => {
  const { base, args, currBailType, index } = props;
  let { radius, position, tube, boundingBoxPoints } = args;
  const { max, min } = boundingBoxPoints;
  const onUpdateBail = (mesh) => {
    let geometry = mesh.geometry;
    const { x, y } = geometry.boundingBox.max;
    let scaleX = 1,
      scaleY = 1

    if (currBailType === "bail0") {
      scaleX = (radius * 2) / x;
      scaleY = (radius * 2) / y;
    }
    geometry.scale(scaleX, scaleY, scaleX);
    mesh.position.z = (max.z + min.z) / 2;
  };

  const bailGeometry = useMemo(
    () => loadBail(currBailType, radius, tube / 5),
    [currBailType, args]
  );
  return (
    <>
      <mesh
        name="bail"
        userData={{ type: "bail", index, currBailType, controllable: true }}
        position={position}
        scale={currBailType === "bail0" ? 1 : radius}
        geometry={bailGeometry}
        rotation-y={currBailType === "bail0" ? 0 : Math.PI / 2}
        onUpdate={onUpdateBail}
      >
        <meshStandardMaterial
          attach="material"
          color={base}
          metalness={1}
          roughness={0.2}
        />
      </mesh>
    </>
  );
};

export default Bail;
