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
          {bails.map((bail, i) => (
            <Bail
              key={bail.type + i}
              args={{
                radius: bail.sizes.diameter / 2,
                tube: bail.sizes.thickness / 5,
                position: [max.x, max.y, (max.z - min.z) / 2],
              }}
              base={base}
              currBailType={bail.type}
            />
          ))}
        </>
      )}
    </>
  );
};

export default Bails;
