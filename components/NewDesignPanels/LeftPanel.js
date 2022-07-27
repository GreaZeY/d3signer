import React, { useEffect, useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import Bail from "components/LeftPanelComponents/Bail";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import Slider from "@material-ui/core/Slider";
import CustomInput from "components/CustomInput/CustomInput.js";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import { useDispatch, useSelector } from "react-redux";
import { designProps } from "../../lib/actions/designAction";
import { fonts } from "./assets/allFonts";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import { Typography } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import useCollapse from "react-collapsed";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

import { stoneShapes, colors, bailType, availableSymbols } from "./panelData";

import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";

const minSizes = {
  Length: 5,
  Thickness: 0,
  Width: -20,
};
const maxSizes = {
  Length: 50,
  Thickness: 2,
  Width: 0,
};

// importing shape components
// import Brilliant from "./StoneComponents/Brilliant";
// import Trilliant from "./StoneComponents/Trilliant";
// import Eight from "./StoneComponents/Eight"
// import Pear from "./StoneComponents/Pear";
// import StepCut from "./StoneComponents/StepCut"

import DiamondMenu from "../LeftPanelComponents/DiamondMenu";
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
  // bail expand and collapse
  const { getCollapseProps, getToggleProps, isExpanded, setExpanded } =
    useCollapse();

  const [currSizeProp, setCurrSizeProp] = useState("Length");
  const [bails, bailsCount] = useState([]);
  const [currBailType, setCurrBailType] = useState("bail0");

  const { designProps: currDesign } = useSelector((state) => state.designProps);
  const {
    text,
    length,
    width,
    thickness,
    font,
    currStoneShape,
    currStoneColor,
    stoneSize,
    symbols,
    symbolSize,
  } = currDesign;

  const dispatch = useDispatch();

  const compareVal = (val) => {
    if (val >= minSizes[currSizeProp] && val <= maxSizes[currSizeProp])
      return val;
    if (currSizeProp === "Length") return length;
    if (currSizeProp === "Width") return width;
    if (currSizeProp === "Thickness") return thickness;
    if (currSizeProp === "StoneSize") return stoneSize;
  };

  const getMin = () =>
    currSizeProp === "Length"
      ? minSizes.Length
      : currSizeProp === "Width"
      ? minSizes.Width
      : minSizes.Thickness;

  const getMax = () =>
    currSizeProp === "Length"
      ? maxSizes.Length
      : currSizeProp === "Width"
      ? maxSizes.Width
      : maxSizes.Thickness;

  const setSizes = (e, val) => {
    currSizeProp === "Length"
      ? dispatch(
          designProps({
            ...currDesign,
            length: val ? compareVal(val) : val,
          })
        )
      : currSizeProp === "Width"
      ? dispatch(
          designProps({
            ...currDesign,
            width: val ? compareVal(val) : val,
          })
        )
      : dispatch(
          designProps({
            ...currDesign,
            thickness: val ? compareVal(val) : val,
          })
        );
  };

  const setBailNumber = () => {
    let bailArr = [...bails];
    bailArr.length++;
    bailArr[bailArr.length - 1] = { position: [0, 0, 0], sizes: {} };
    bailsCount(bailArr);

    setExpanded(true);
  };

  const getText = (e) => {
    let txt = e.target.value;
    txt = txt.replace(" ", "");
    dispatch(designProps({ ...currDesign, text: txt }));
  };

  // dispatching design's properties
  useEffect(() => {
    dispatch(
      designProps({
        ...currDesign,
        bails,
      })
    );
  }, [bails]);

  // const setStoneColor = e => {
  //   if (e.target.tagName !== 'svg' || e.target.tagName !== 'path')
  //     dispatch(designProps({ ...currDesign, currStoneColor: e.target.getAttribute('fill') }))

  // }

  const setStoneShape = (e) => {
    let shape = e.target.getAttribute("shape-data");
    if (!shape) return;
    dispatch(designProps({ ...currDesign, currStoneShape: shape }));
  };

  const dispatchSymbol = (e) => {
    let sym = e.target.title;
    // if (symbols.includes(sym)) {
    //   let tmpSyms = symbols.filter(tmpSym => sym !== tmpSym)
    //   return dispatch(designProps({ ...currDesign, symbols: tmpSyms }))
    // }
    return dispatch(designProps({ ...currDesign, symbols: [...symbols, sym] }));
  };

  const setStoneSize = (e, val) => {
    dispatch(designProps({ ...currDesign, stoneSize: val }));
  };

  const [showTip, setShowTip] = useState(false);

  return (
    <GridItem xs={12} sm={12} md={3}>
      <Card>
        <CardBody
          className="left-panel"
          style={{ height: "75vh", overflowY: "scroll" }}
        >
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
                  dispatch(designProps({ ...currDesign, font: e.target.value }))
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

          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                marginTop: "1rem",
                marginRight: "2rem",
                justifyContent: "space-between",
              }}
              className={classes.flexRow}
            >
              <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <InputLabel>Sizes</InputLabel>
                <Select
                  size="small"
                  value={currSizeProp}
                  label="Size"
                  onChange={(e) => setCurrSizeProp(e.target.value)}
                >
                  <MenuItem value={"Length"}>Length</MenuItem>
                  <MenuItem value={"Width"}>Letter Spacing</MenuItem>
                  <MenuItem value={"Thickness"}>Thickness</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div
              style={{ marginTop: "2rem", width: "100%" }}
              className={classes.flexRow}
            >
              <ThemeProvider theme={muiTheme}>
                <Slider
                  aria-label="Sizes"
                  onChange={setSizes}
                  step={0.1}
                  style={{ marginRight: "1rem" }}
                  min={getMin()}
                  max={getMax()}
                  value={
                    currSizeProp === "Length"
                      ? length
                      : currSizeProp === "Width"
                      ? width
                      : thickness
                  }
                  color="primary"
                />
              </ThemeProvider>
              <input
                onChange={(e) => setSizes(e, parseFloat(e.target.value))}
                style={{ padding: ".2rem", cursor: "text", width: "2rem" }}
                type="number"
                min={getMin()}
                max={getMax()}
                className={classes.symbol}
                step={0.1}
                value={
                  currSizeProp === "Length"
                    ? length
                    : currSizeProp === "Width"
                    ? width
                    : thickness
                }
              />
            </div>
          </div>

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
          <div style={{ marginTop: "1rem" }}>
            <div>
              <InputLabel className="settings-head">Add Symbols</InputLabel>
              <div onClick={dispatchSymbol} className={classes.flexRow}>
                {availableSymbols.map((symbol) => (
                  <div
                    title={symbol.title}
                    style={{
                      border:
                        symbols.includes(symbol.title) && "2px solid #8e24aa",
                    }}
                    className={classes.symbol}
                  >
                    {symbol.symbol}
                  </div>
                ))}
              </div>
            </div>
            {symbols.length > 0 && (
              <>
                <InputLabel
                  style={{ marginTop: "1rem", width: "100%" }}
                  className="settings-head"
                >
                  Size
                </InputLabel>
                <div style={{ width: "100%" }} className={classes.flexRow}>
                  <Slider
                    aria-label="Sizes"
                    style={{ marginRight: "1rem" }}
                    color="primary"
                    step={0.1}
                    min={0.4}
                    max={2}
                    value={symbolSize}
                    onChange={(e, val) =>
                      dispatch(designProps({ ...currDesign, symbolSize: val }))
                    }
                  />
                  <input
                    className={classes.symbol}
                    style={{ padding: ".2rem", cursor: "text", width: "2rem" }}
                    type="number"
                    step={0.1}
                    min={0.4}
                    max={2}
                    value={symbolSize}
                    onChange={(e) =>
                      dispatch(
                        designProps({
                          ...currDesign,
                          symbolSize: e.target.value,
                        })
                      )
                    }
                  />
                </div>
              </>
            )}
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
                Choose Shape and color first to place stones, and Right Click to
                remove the placed stone.
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
            {/* {
                stoneImages.map(img=>(
                  <img src={img.src} style={{border:currStone===img.src&&'2px solid #8e24aa'}} className={classes.base} alt={img.src} />
                ))
              } */}
            {currStoneShape && (
              <div style={{ marginTop: ".5rem" }}>
                <InputLabel className="settings-head">Color</InputLabel>
                <div
                  className={classes.flexRow}
                  // onClick={setStoneColor}
                  style={{ flexWrap: "wrap", height: "2rem", width: "100%" }}
                >
                  <DiamondMenu color={currStoneColor} model={currStoneShape} />
                  {
                    //   stoneColor.map(color => (
                    //     // <div style={{ border: currStoneColor === color && '2px solid #8e24aa', background: color }} className={classes.stoneShape + ' ' + classes.flexRow}>
                    //     //   {/* <img className={classes.img} src={`${imgDir}/${color}.png`} alt={color} /> */}
                    //     // </div>
                    // ))
                    // currStoneShape === 'brilliant' ?
                    //   stoneColor.map(color => (
                    //     <Brilliant width='1rem' color={color} />
                    //   ))
                    //   :
                    //   currStoneShape === 'trilliant' ?
                    //     stoneColor.map(color => (
                    //       <Trilliant width='1rem' color={color} />
                    //     ))
                    //     :
                    //     currStoneShape === 'eight' ?
                    //       stoneColor.map(color => (
                    //         <Eight width='1rem' color={color} />
                    //       ))
                    //       :
                    //       currStoneShape === 'pear' ?
                    //         stoneColor.map(color => (
                    //           <Pear width='1rem' color={color} />
                    //         ))
                    //         : stoneColor.map(color => (
                    //           <StepCut width='1rem' color={color} />
                    //         ))
                  }
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
          <div style={{ marginTop: "1rem" }}>
            <div
              style={{
                width: "100%",
                marginTop: "1rem",
                justifyContent: "space-between",
              }}
              className={classes.flexRow}
            >
              <Button disabled={true} {...getToggleProps()} size="small">
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
              </Button>
              <Button size="small" onClick={setBailNumber}>
                {" "}
                <AddIcon />
              </Button>
            </div>
            <section {...getCollapseProps()}>
              <InputLabel
                style={{ marginLeft: "1rem" }}
                className="settings-head"
              >
                Bails
              </InputLabel>
              <div
                className={classes.flexRow}
                style={{ flexWrap: "wrap", marginLeft: "1rem" }}
              >
                {bailType.map((bail, i) => (
                  <div
                    onClick={(e) => setCurrBailType(e.target.alt)}
                    key={i}
                    style={{
                      border: currBailType === bail && "3px solid #8e24aa",
                    }}
                    className={classes.bailType + " " + classes.flexRow}
                  >
                    <img
                      width={25}
                      height={25}
                      src={`/assets/bails/img/${bail}.png`}
                      alt={bail}
                    />
                  </div>
                ))}
              </div>

              {bails.map((bail, i) => (
                <Bail
                  key={i}
                  index={i}
                  currBailType={currBailType}
                  bails={bails}
                  setBailsData={bailsCount}
                  classes={classes}
                />
              ))}
            </section>
          </div>
        </CardBody>
      </Card>
    </GridItem>
  );
};

export default LeftPanel;
