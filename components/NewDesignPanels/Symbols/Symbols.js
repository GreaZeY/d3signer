import Symbol from "./Symbol";
import { useSelector } from "react-redux";
const Symbols = ({ boundingBoxPoints }) => {
  const { designProps } = useSelector((state) => state.designProps);
  const { symbols } = designProps;

  return symbols.length > 0 ? (
    symbols.map((symbol, index) => (
      <Symbol
        key={symbol + index}
        props={{ symbol, boundingBoxPoints, index }}
      />
    ))
  ) : (
    <></>
  );
};

export default Symbols;
