import Bail from "./Bail";
import { useSelector } from "react-redux";

const Bails = ({ boundingBoxPoints }) => {
  const { max, min } = boundingBoxPoints;
  const { designProps } = useSelector((state) => state.designProps);
  const { bails, base } = designProps;

  return (
    <>
      {bails.length > 0 && (
        <>
          {bails.map(({ sizes, type, transform }, i) => (
            <Bail
              key={type + i}
              args={{
                radius: sizes.diameter / 2,
                tube: sizes.thickness,
                pos: [max.x, max.y, (max.z + min.z) / 2],
                boundingBoxPoints,
              }}
              base={base}
              currBailType={type}
              index={i}
              transform={transform}
            />
          ))}
        </>
      )}
    </>
  );
};

export default Bails;
