import { useSelector } from "react-redux";
import LoadModel from "./LoadModel";
const LoadModels = () => {
  const { designProps } = useSelector((state) => state.designProps);
  const { models, base } = designProps;

  return models.length > 0 ? (
    models.map((url) => (
      <LoadModel key={url} url={url} color={base}/>
    ))
  ) : (
    <></>
  );
};

export default LoadModels;
