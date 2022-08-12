import { useState } from "react";
import BailMenu from "components/LeftPanelComponents/BailMenu.js";
import SymbolMenu from "components/LeftPanelComponents/SymbolMenu.js";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import Slider from "@material-ui/core/Slider";
import CustomInput from "components/CustomInput/CustomInput.js";
import { useDispatch, useSelector } from "react-redux";
import { designProps } from "../../lib/actions/designAction";
import { fonts } from "./assets/allFonts";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import { Typography } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import DropdownSliders from "components/CustomDropdownSliders/DropdownSliders.js";
import { stoneShapes, colors } from "./panelData";
import { compareVal } from "./utils/utils";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import DiamondMenu from "../LeftPanelComponents/DiamondMenu";
import {
  lengthBounds,
  thicknessBounds,
  letterSpacingBounds,
  lineHeightsBounds,
} from "../../lib/constants/pendantDimensionConstants";
import { fillArray } from "../../lib/utils";
const shapeDir = "/assets/crimps/stoneShapes";

const muiTheme = createMuiTheme({
  overrides: {
    MuiSlider: {
      thumb: {
        color: "#BF953F",
      },
      track: {
        color: "#FDB931",
      },
    },
  },
});

const LeftPanel = ({ props }) => {
  const { classes } = props;

  const { designProps: currDesign } = useSelector((state) => state.designProps);
  const {
    text,
    length,
    thickness,
    font,
    currStoneShape,
    currStoneColor,
    stoneSize,
    letterSpacings,
    lineHeights,
    symbols,
    bails,
  } = currDesign;

  const dispatch = useDispatch();

  const setSizes = (val, currItem) => {
    currItem === 0
      ? dispatch(
          designProps({
            ...currDesign,
            length: val ? compareVal(val, 5, 50) : val,
          })
        )
      : dispatch(
          designProps({
            ...currDesign,
            thickness: val ? compareVal(val, 0.4, 2) : val,
          })
        );
  };

  const getText = (e) => {
    let txt = e.target.value;
    txt = txt.replace(" ", "");
    dispatch(designProps({ ...currDesign, text: txt }));
  };

  const setSpacings = (val, currItem) => {
    let spaces = [...letterSpacings];
    spaces[currItem] = val;
    dispatch(designProps({ ...currDesign, letterSpacings: spaces }));
  };

  const setLineHeights = (val, currItem) => {
    let spaces = [...lineHeights];
    spaces[currItem] = val;
    dispatch(designProps({ ...currDesign, lineHeights: spaces }));
  };

  const setStoneShape = (e) => {
    let shape = e.target.getAttribute("shape-data");
    if (!shape) return;
    if (currStoneShape === shape) shape = null;
    dispatch(designProps({ ...currDesign, currStoneShape: shape }));
  };

  const setStoneSize = (e, val) => {
    dispatch(designProps({ ...currDesign, stoneSize: val }));
  };

  const addSymbol = (newSymbol) => {
    return dispatch(
      designProps({ ...currDesign, symbols: [...symbols, newSymbol] })
    );
  };

  const addBail = (newBail) => {
    return dispatch(designProps({ ...currDesign, bails: [...bails, newBail] }));
  };

    const setBailSizes = (val, currProp, index) => {
      let prevBails = [...bails];
      let targetBail = [...bails][index];

      if (currProp === 0) {
        targetBail.sizes["diameter"] = val;
      } else {
        targetBail[index].sizes["thickness"] = val;
      }

      prevBails[index] = targetBail;
      console.log("chagne", currProp, index, prevBails, bails);

      let newDesign = { ...currDesign, bails: prevBails };
      dispatch(designProps(newDesign));
    };


  const [showTip, setShowTip] = useState(false);

  return (
    <GridItem xs={12} sm={12} md={3}>
      <Card>
        <CardBody
          className="left-panel"
          style={{ height: "75vh", overflowY: "scroll" }}
        >
          <ThemeProvider theme={muiTheme}>
            <Typography>Settings</Typography>
            <CustomInput
              labelText="Text (Your Name)"
              id="text"
              inputProps={{
                onChange: getText,
                value: text,
                maxLength: 10,
              }}
              formControlProps={{
                fullWidth: true,
                marginTop: 0,
              }}
            />
            {fonts.length && (
              <FormControl style={{ width: "100%", marginTop: "1rem" }}>
                <InputLabel>Font</InputLabel>
                <Select
                  value={font}
                  label="font"
                  onChange={(e) =>
                    dispatch(
                      designProps({ ...currDesign, font: e.target.value })
                    )
                  }
                >
                  {fonts.map((ff) => (
                    <MenuItem
                      key={ff.original_font_information.fullName}
                      value={ff.original_font_information.fullName}
                    >
                      {ff.original_font_information.fullName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            <DropdownSliders
              items={["Width", "Thickness"]}
              values={[length, thickness]}
              onChange={setSizes}
              classes={classes}
              mins={[lengthBounds.min, thicknessBounds.min]}
              maxs={[lengthBounds.max, thicknessBounds.max]}
              label="Sizes"
            />
            <DropdownSliders
              items={[...text]}
              values={letterSpacings}
              onChange={setSpacings}
              classes={classes}
              label="Letter Spacings"
              mins={fillArray(text.length, letterSpacingBounds.min)}
              maxs={fillArray(text.length, letterSpacingBounds.max)}
            />
            <DropdownSliders
              items={[...text]}
              values={lineHeights}
              onChange={setLineHeights}
              classes={classes}
              label="Line Heights"
              mins={fillArray(text.length, lineHeightsBounds.min)}
              maxs={fillArray(text.length, lineHeightsBounds.max)}
            />
            <div style={{ marginTop: "1rem" }}>
              <InputLabel className="settings-head">Base Material</InputLabel>
              <div
                onClick={(e) =>
                  dispatch(
                    designProps({ ...currDesign, base: e.target.style.color })
                  )
                }
                className={classes.flexRow}
              >
                {colors.map((item) => (
                  <div
                    className={classes.base + " metallic-gold"}
                    title={item.name}
                    style={{
                      color: item.color,
                      background: `url('/assets/img/bases/${item.name}.png')`,
                    }}
                  ></div>
                ))}
              </div>
            </div>
            <fieldset
              style={{
                position: "relative",
                marginTop: "1rem",
                border: "1px solid rgb(185 183 183)",
                width: "max-content",
              }}
            >
              <legend className={classes.flexRow + " settings-head"}>
                Diamonds & Stones{" "}
                <InfoOutlinedIcon
                  onMouseEnter={() => setShowTip(true)}
                  onMouseLeave={() => setShowTip(false)}
                  title="Tip"
                  style={{
                    fontSize: "1rem",
                    color: "black",
                    cursor: "pointer",
                    marginLeft: ".3rem",
                  }}
                />{" "}
              </legend>
              {showTip && (
                <div className={classes.infoTip}>
                  Choose Shape and color first to place stones, and Right Click
                  to remove the placed stone.
                </div>
              )}
              <div>
                <InputLabel className="settings-head">Shape</InputLabel>
                <div
                  onClick={setStoneShape}
                  className={classes.flexRow}
                  style={{ flexWrap: "wrap" }}
                >
                  {stoneShapes.map((shape) => (
                    <div
                      style={{
                        border: currStoneShape === shape && "2px solid #8e24aa",
                        background: `url('${shapeDir}/${shape}.svg')`,
                        backgroundPosition: "center",
                        backgroundSize: "1rem 1rem",
                      }}
                      shape-data={shape}
                      className={classes.stoneShape + " " + classes.flexRow}
                    ></div>
                  ))}
                </div>
              </div>
              {currStoneShape && (
                <div style={{ marginTop: ".5rem" }}>
                  <InputLabel className="settings-head">Color</InputLabel>
                  <div
                    className={classes.flexRow}
                    style={{ flexWrap: "wrap", height: "2rem", width: "100%" }}
                  >
                    <DiamondMenu
                      color={currStoneColor}
                      model={currStoneShape}
                    />
                  </div>
                </div>
              )}
              <div style={{ marginTop: ".5rem" }}>
                <InputLabel className="settings-head">Stone Size</InputLabel>
                <div style={{ width: "100%" }} className={classes.flexRow}>
                  <Slider
                    aria-label="Sizes"
                    onChange={setStoneSize}
                    step={0.1}
                    style={{ marginRight: "1rem" }}
                    max={10.0}
                    min={0.5}
                    value={stoneSize}
                  />
                  <input
                    onChange={(e) => setStoneSize(e, e.target.value)}
                    value={stoneSize}
                    type="number"
                    step=".1"
                    max="10.0"
                    min="0.5"
                    className={classes.symbol}
                    style={{ width: "2.5rem" }}
                  />
                </div>
              </div>
            </fieldset>
            <SymbolMenu props={{ classes, symbols, addSymbol }} />
            <BailMenu props={{ classes, bails, addBail, setBailSizes }} />
          </ThemeProvider>
        </CardBody>
      </Card>
    </GridItem>
  );
};

export default LeftPanel;
