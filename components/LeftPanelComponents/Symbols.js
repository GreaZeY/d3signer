import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { designProps } from "../../lib/actions/designAction";
import DropdownSliders from "components/CustomDropdownSliders/DropdownSliders.js";
import { delay } from "../NewDesignPanels/utils/utils";

const Symbol = (props) => {
  const { classes, symbols, setsymbolsData, index, currSymbolShape } = props;
  const { designProps } = useSelector((state) => state.designProps);

  const [size, setSize] = useState(.5);
  const [position, setPosition] = useState([]);

    const dispatch = useDispatch();

  useEffect(() => {
    if (designProps.symbols[index]) {
      setPosition(designProps.symbols[index].position);
      setSize(designProps.symbols[index].size);
    }
  }, [designProps]);

  useEffect(() => {
    let currSymbol = [...symbols];
    currSymbol[index].position = position;
    currSymbol[index].symbol = currSymbolShape;
    currSymbol[index].sizes = size;
    dispatch(currSymbol);
  }, [size, position]);

  // const deleteSymbol = () => {
  //   let currSymbol = [...symbols];
  //   currSymbol = symbols.filter((symbol, i) => i !== index);
  //   setsymbolsData(currSymbol);
  // };

  const setSizes = (val, currItem) => {

  };

  const debounce = delay((val, currItem) => setSizes(val, currItem));

  return (
    <div style={{ display: "flex",alignItems:'center' }}>
      <DropdownSliders
        items={["Size"]}
        values={[size]}
        onChange={debounce}
        classes={classes}
        mins={[symbolDiameterBounds.min, symbolThicknessBounds.min]}
        maxs={[symbolDiameterBounds.max, symbolThicknessBounds.max]}
        label="Sizes"
      />
      {/* <DeleteForeverIcon className={classes.delete} onClick={deleteSymbol} /> */}
    </div>
  );
};

export default Symbol;
