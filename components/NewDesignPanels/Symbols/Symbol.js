import { useMemo } from "react";
import { useSelector } from "react-redux";
import { createShape } from "../utils/threeUtils";
import * as THREE from "three";
const extrudeSettings = {
  bevelEnabled: false,
  curveSegments: 10,
  bevelSegments: 30,
  bevelThickness: 10,
  bevelSize: 10,
};

const Symbols = ({ props }) => {
  const { symbol, boundingBoxPoints, index } = props;
  const { max, min } = boundingBoxPoints;
  const { designProps } = useSelector((state) => state.designProps);
  const { base, symbolSize } = designProps;
  const shape = useMemo(() => createShape(symbol), [symbol]);

  const onUpdateSymbol = (mesh) => {
    let geometry = mesh.geometry;
    geometry.center();
    const { x, y, z } = geometry.boundingBox.max;
    geometry.scale(max.x / x / 3, max.y / y / 2, max.z / z);
    mesh.position.z = (max.z + min.z) / 2;
    mesh.scale.x = symbolSize;
    mesh.scale.y = symbolSize;
  };

  if (!symbol) return <></>;
  return (
    <>
      <mesh
        name={symbol}
        position={max}
        rotation-x={Math.PI}
        userData={{ type: "symbol", index, symbol }}
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
