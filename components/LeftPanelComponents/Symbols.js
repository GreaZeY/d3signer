import { useSelector, useDispatch } from "react-redux";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { designProps } from "../../lib/actions/designAction";
import DropdownSliders from "components/CustomDropdownSliders/DropdownSliders.js";

const Symbol = (props) => {
  const { classes, symbol, index } = props;
  const { designProps: currDesign } = useSelector((state) => state.designProps);
  const dispatch = useDispatch();

  const setSizes = (val) => {
    let prevSyms = [...currDesign.symbols];
    prevSyms[index].size = val;
    let newDesign = { ...currDesign, symbols: prevSyms };
    dispatch(designProps(newDesign));
  };

  const deleteSymbol = () => {
    let prevSyms = [...currDesign.symbols];
    prevSyms = prevSyms.filter((s, i) => i !== index);
    let newDesign = { ...currDesign, symbols: prevSyms };
    dispatch(designProps(newDesign));
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <DropdownSliders
        items={["Size"]}
        values={[symbol.size]}
        onChange={setSizes}
        classes={classes}
        mins={[0]}
        maxs={[1]}
        label="Sizes"
      />
      <DeleteForeverIcon className={classes.delete} onClick={deleteSymbol} />
    </div>
  );
};

export default Symbol;
