import { useSelector, useDispatch } from "react-redux";
import { designProps } from "../../lib/actions/designAction";
import DropdownSliders from "components/CustomDropdownSliders/DropdownSliders.js";

const Symbol = (props) => {
  const { classes, symbols } = props;
  const { designProps: currDesign } = useSelector((state) => state.designProps);
  const dispatch = useDispatch();

  const setSizes = (val, index) => {
    let prevSyms = [...symbols];
    prevSyms[index].size = val;
    let newDesign = { ...currDesign, symbols: prevSyms };
    dispatch(designProps(newDesign));
  };

  const deleteSymbol = (index) => {
    let prevSyms = [...symbols];
    prevSyms = prevSyms.filter((s, i) => i !== index);
    let newDesign = { ...currDesign, symbols: prevSyms };
    dispatch(designProps(newDesign));
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <DropdownSliders
        items={symbols.map((sym) => (
          <img
            title={sym.type}
            width={12}
            src={`/assets/symbols/${sym.type}.svg`}
            alt={sym.type}
          />
        ))}
        values={symbols.map((sym) => sym.size)}
        onChange={setSizes}
        classes={classes}
        mins={symbols.map(() => 0.1)}
        maxs={symbols.map(() => 1)}
        label="Size(s)"
        onDelete={deleteSymbol}
      />
    </div>
  );
};

export default Symbol;

