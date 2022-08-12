import { useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import InputLabel from "@material-ui/core/InputLabel";
import { bailType } from "../NewDesignPanels/panelData";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import Bail from './Bail'
import useCollapse from "react-collapsed";
import {
  bailThicknessBounds,
  bailDiameterBounds,
} from "../../lib/constants/pendantDimensionConstants";
const sizes = {
  diameter: bailDiameterBounds.min,
  thickness: bailThicknessBounds.min,
};

const BailsMenu = ({ props }) => {
  const { classes, bails, addBail, setBailSizes } = props;
  const { getCollapseProps, getToggleProps, isExpanded, setExpanded } =
    useCollapse();

  const [currBail, setCurrBail] = useState(bailType[0]);

  const setCurrentBail = (e) => {
    let bl = e.target.getAttribute("bail-type");
    if (!bl) return;
    setCurrBail(bl);
  };

  const onAddBail = () => {
    let bail = {
      transform: {},
      sizes,
      type: currBail,
    };
    addBail(bail);
    setExpanded(false);
  };

  return (
    <div style={{ marginTop: "1rem" }}>
      <div
        style={{
          width: "100%",
          marginTop: "1rem",
          justifyContent: "space-between",
        }}
        className={classes.flexRow + " " + classes.collapse}
        {...getToggleProps()}
      >
        <div
          className={classes.flexRow}
          style={{
            fontWeight: 500,
          }}
        >
          {isExpanded ? (
            <>
              <KeyboardArrowUpIcon />
            </>
          ) : (
            <>
              <KeyboardArrowDownIcon />
            </>
          )}{" "}
          Bails {`(${bails.length})`}
        </div>
        <AddIcon onClick={onAddBail} className={classes.cursorPointer} />
      </div>
      <section {...getCollapseProps()}>
        <InputLabel className="settings-head">Bails</InputLabel>
        <div
          onClick={setCurrentBail}
          className={classes.flexRow}
          style={{ flexWrap: "wrap" }}
        >
          {bailType.map((bail, i) => (
            <div
              bail-type={bail}
              key={i}
              style={{
                border:
                  currBail === bail && "3px solid var(--active-border-color)",
              }}
              className={classes.bailType + " " + classes.flexRow}
            >
              <img
                bail-type={bail}
                width={25}
                height={25}
                src={`/assets/bails/img/${bail}.png`}
                alt={bail}
              />
            </div>
          ))}
        </div>
        <Bail bails={bails} classes={classes} setSizes={setBailSizes} />
      </section>
    </div>
  );
};

export default BailsMenu;
