import Symbol from "./Symbol";
import { useSelector } from "react-redux";
const Symbols = ({ boundingBoxPoints }) => {
  const { designProps } = useSelector((state) => state.designProps);
  const { symbols } = designProps;

  return symbols.length > 0 ? (
    symbols.map(({ type, transform }, index) => (
      <Symbol
        key={type + index}
        props={{ symbol: type, transform, boundingBoxPoints, index }}
      />
    ))
  ) : (
    <></>
  );
};

export default Symbols;
