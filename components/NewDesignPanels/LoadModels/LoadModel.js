import { load3DModel } from "../utils/threeUtils";
import { useMemo } from "react";

const LoadModel = ({ url, color }) => {
  const object = useMemo(() => load3DModel(url), [url]);
  console.log(object);

  return (
    <primitive
      object={object.scene}
      color={color}
      scale={0.3}
    />
  );
};

export default LoadModel;
