import { useMemo } from "react";
import { useSelector,useDispatch } from "react-redux";
import { updateDesignProps } from "../../../lib/actions/designAction";
import { createShape } from "../utils/threeUtils";
const extrudeSettings = {
  bevelEnabled: false,
  curveSegments: 10,
  bevelSegments: 30,
  bevelThickness: 10,
  bevelSize: 10,
};

const Symbols = ({ props }) => {
    const dispatch = useDispatch();
  const { symbol, boundingBoxPoints, index, transform, size } = props;
  const { max, min } = boundingBoxPoints;
  const { designProps } = useSelector((state) => state.designProps);
  const { base } = designProps;
  const { rotation, scale, position } = transform;
  console.log('key',transform);
  const shape = useMemo(() => createShape(symbol), [symbol]);


  const onUpdateSymbol = (mesh) => {
    let geometry = mesh.geometry;
    geometry.center();
    const { x, z } = geometry.boundingBox.max;
    geometry.scale((max.x / x / 3)*size, (max.x / x / 3)*size, max.z / z);
    mesh.position.z = (max.z + min.z) / 2;

    dispatch(updateDesignProps(mesh));
  };

  if (!symbol) return <></>;
  return (
    <>
      <mesh
        name={symbol}
        position={position?position:max}
        position-y={max.y / 2}
        rotation-x={Math.PI}
        scale={scale&&[scale.x,scale.y,scale.z]}
        userData={{ group: "symbols", index, symbol, controllable: true }}
        onUpdate={onUpdateSymbol}
      >
        <extrudeGeometry
          onUpdate={(g) => g.center()}
          args={[shape, extrudeSettings]}
        />
        <meshStandardMaterial color={base} metalness={1} roughness={0.2} />
      </mesh>
    </>
  );
};

export default Symbols;
