import { useMemo } from "react";
import { loadBail } from "../utils/threeUtils";
import { updateDesignProps } from "../../../lib/actions/designAction";
import { useDispatch } from "react-redux";

const Bail = (props) => {
  const dispatch = useDispatch();
  const { base, args, currBailType, index, transform } = props;
  const { rotation, scale, position } = transform;
  let { radius, pos, tube, boundingBoxPoints } = args;
  const { max, min } = boundingBoxPoints;

  const onUpdateBail = (mesh) => {
    let geometry = mesh.geometry;
    const { x, y, z } = geometry.boundingBox.max;
    let scaleX = 1,
      scaleY = 1,
      scaleZ = 1;
    if (currBailType === "bail0") {
      scaleX = (radius * 2) / x;
      scaleY = (radius * 2) / y;
      scaleZ = scaleX;
    }else{
       scaleX = (radius * 4) / x;
       scaleY = (radius * 8) / y;
       scaleZ = (radius * 12) / z;
    }

    geometry.scale(scaleX, scaleY, scaleZ);
debugger
    dispatch(updateDesignProps(mesh));
  };

  const getRotation = () => {
    let rx = 0,
      ry = 0,
      rz = 0;
    if (rotation) {
      rx = rotation._x;
      ry = rotation._y;
      rz = rotation._z;
    } else {
      if (currBailType !== "bail0") {
        ry = Math.PI / 2;
      }
    }
    return [rx, ry, rz];
  };

  const getScale = () => {
    let sx = 1,
      sy = 1,
      sz = 1;
    if (scale) {
      sx = scale.x;
      sy = scale.y;
      sz = scale.z;
    } else {
      if (currBailType !== "bail0") {
        sx = radius;
        sy = radius;
        sz = radius;
      }
    }
    return [sx, sy, sz];
  };

  const bailGeometry = useMemo(
    () => loadBail(currBailType, radius, tube / 5),
    [currBailType, args]
  );
  return (
    <>
      <mesh
        name="bail"
        userData={{ group: "bails", index, currBailType, controllable: true }}
        position={position ? [position.x, position.y, position.z] : pos}
        scale={getScale()}
        geometry={bailGeometry}
        rotation={getRotation()}
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
