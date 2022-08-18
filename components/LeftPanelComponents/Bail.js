import { useSelector, useDispatch } from "react-redux";
import { designProps } from "../../lib/actions/designAction";
import DropdownSliders from "components/CustomDropdownSliders/DropdownSliders.js";
import {
  bailThicknessBounds,
  bailDiameterBounds,
} from "../../lib/constants/pendantDimensionConstants";

const Bails = (props) => {
  const { classes, bails, setSizes, onCopy } = props;
  const { designProps: currDesign } = useSelector((state) => state.designProps);
  const dispatch = useDispatch();

  const deleteBail = (index) => {
    let prevBails = [...bails];
    prevBails = prevBails.filter((s, i) => i !== index);
    let newDesign = { ...currDesign, bails: prevBails };
    dispatch(designProps(newDesign));
  };

  return (
    <>
      {bails.map((bail, index) => (
        <div
          key={bail.type + index}
          style={{ display: "flex", alignItems: "center" }}
        >
          <DropdownSliders
            items={[bail.type === "bail0" ? "Diameter" : "Size", "Thickness"]}
            values={[bail.sizes.diameter, bail.sizes.thickness]}
            onChange={(val, currProp) => setSizes(val, currProp, index)}
            classes={classes}
            mins={[bailDiameterBounds.min, bailThicknessBounds.min]}
            maxs={[bailDiameterBounds.max, bailThicknessBounds.max]}
            onDelete={deleteBail}
            onCopy={onCopy}
            label="Size(s)"
            passIndex={true}
            index={index}
          />
          <button
            style={{ display: "none" }}
            id={"deleteBailBtn" + index}
            onClick={deleteBail}
          ></button>
        </div>
      ))}
    </>
  );
};

export default Bails;
