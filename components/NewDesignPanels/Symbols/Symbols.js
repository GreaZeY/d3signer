import Symbol from "./Symbol";
import { useSelector } from "react-redux";
const Symbols = ({ boundingBoxPoints }) => {
  const { designProps } = useSelector((state) => state.designProps);
  const { symbols, base } = designProps;
  return symbols.length > 0 ? (
    symbols.map(({ type, transform, size }, index) => (
      <Symbol
        key={type + index}
        props={{
          symbol: type,
          transform,
          size,
          boundingBoxPoints,
          index,
          base,
        }}
      />
    ))
  ) : (
    <></>
  );
};

export default Symbols;
