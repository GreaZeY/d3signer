import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import {
  bailThicknessBounds,
  bailDiameterBounds,
} from "../../lib/constants/pendantDimensionConstants";
const sizes = {
  diameter: bailDiameterBounds.min,
  thickness: bailThicknessBounds.min,
};
import DropdownSliders from "components/CustomDropdownSliders/DropdownSliders.js";
import { delay } from "../NewDesignPanels/utils/utils";

const Bail = (props) => {
  const { classes, bails, setBailsData, index, currBailType } = props;
  const { designProps } = useSelector((state) => state.designProps);

  const [bailSizes, setBailSizes] = useState(sizes);
  const [currBailPosition, setCurrBailPosition] = useState([]);

  useEffect(() => {
    if (designProps.bails[index]) {
      setCurrBailPosition(designProps.bails[index].position);
      setBailSizes(designProps.bails[index].sizes);
    }
  }, [designProps]);

  useEffect(() => {
    let currBail = [...bails];
    currBail[index].position = [0,0,0];
    if (!currBail[index].type) currBail[index].type = currBailType;
    if (!currBail[index].dimensionType)
      currBail[index].dimensionType =
        currBailType === "bail0" ? "Diameter" : "Size";
    currBail[index].sizes = bailSizes;
    console.log(currBail);
    setBailsData(currBail);
  }, [bailSizes, currBailPosition]);

  const deleteBail = () => {
    let currBail = [...bails];
    currBail = bails.filter((bail, i) => i !== index);
    setBailsData(currBail);
  };

  const setSizes = (val, currItem) => {
    currItem === 0
      ? setBailSizes({ ...bailSizes, diameter: val })
      : setBailSizes({ ...bailSizes, thickness: val });
  };

  const debounce = delay((val, currItem) => setSizes(val, currItem));

  return (
    <div style={{ display: "flex",alignItems:'center' }}>
      <DropdownSliders
        items={[designProps?.bails[index]?.dimensionType, "Thickness"]}
        values={[bailSizes.diameter, bailSizes.thickness]}
        onChange={debounce}
        classes={classes}
        mins={[bailDiameterBounds.min, bailThicknessBounds.min]}
        maxs={[bailDiameterBounds.max, bailThicknessBounds.max]}
        label="Sizes"
      />
      <DeleteForeverIcon className={classes.delete} onClick={deleteBail} />
    </div>
  );
};

export default Bail;
