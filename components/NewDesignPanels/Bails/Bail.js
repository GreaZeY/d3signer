import { useMemo } from "react";
import { loadBail } from "../utils/threeUtils";
import { updateDesignProps } from "../../../lib/actions/designAction";
import { useDispatch } from "react-redux";

const Bail = (props) => {
  const dispatch = useDispatch();
  const { base, args, currBailType, index, transform } = props;
  const { rotation, scale, position } = transform;
  let { diameter, pos, tube } = args;

  const onUpdateBail = (mesh) => {
    let geometry = mesh.geometry;
    const { x, z } = geometry.boundingBox.max;
    let scaleX = diameter / x,
      scaleY = scaleX,
      scaleZ = scaleX;
    if (currBailType !== "bail0") {
      scaleX = diameter / z;
      scaleY = scaleX;
      scaleZ = scaleX;
    }

    mesh.scale.set(scaleX, scaleY, scaleZ);
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

  const bailGeometry = useMemo(
    () => loadBail(currBailType, diameter, tube / 5),
    [currBailType, args]
  );
  return (
    <>
      <mesh
        name="bail"
        userData={{ group: "bails", index, currBailType, controllable: true }}
        position={position ? [position.x, position.y, position.z] : pos}
        scale={scale && [scale.x, scale.y, scale.z]}
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
