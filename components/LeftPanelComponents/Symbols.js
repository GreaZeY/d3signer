import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { designProps } from "../../lib/actions/designAction";
import DropdownSliders from "components/CustomDropdownSliders/DropdownSliders.js";
import { delay } from "../NewDesignPanels/utils/utils";

const Symbol = (props) => {
  const { classes, symbols, index, currSymbolShape } = props;
  const { designProps: currDesign } = useSelector((state) => state.designProps);
  const dispatch = useDispatch();

  const setSizes = (val) => {
    let prevSym = [...currDesign.symbols];
    prevSym[index].size = val;
    dispatch(
      designProps(dispatch(designProps({ ...currDesign, symbols: prevSym })))
    );
  };

  const debounce = delay((val, currItem) => setSizes(val, currItem));

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <DropdownSliders
        items={["Size"]}
        values={[symbols[index].size]}
        onChange={debounce}
        classes={classes}
        mins={[0]}
        maxs={[1]}
        label="Sizes"
      />
      {/* <DeleteForeverIcon className={classes.delete} onClick={deleteSymbol} /> */}
    </div>
  );
};

export default Symbol;
