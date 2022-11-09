import { useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import InputLabel from "@material-ui/core/InputLabel";
import { availableSymbols } from "../NewDesignPanels/panelData";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import Symbols from "./Symbols.js";
import useCollapse from "react-collapsed";

const SymbolMenu = ({ props }) => {
  const { classes, symbols, addSymbol } = props;
  const { getCollapseProps, getToggleProps, isExpanded, setExpanded } =
    useCollapse();

  const [currSymbol, setCurrSymbol] = useState(availableSymbols[0].title);

  const setCurrentSymbol = (e) => {
    let sym = e.target.title;
    if (!sym) return;
    setCurrSymbol(sym);
  };

  const onAddSymbol = () => {
    let sym = {
      type: currSymbol,
      size: 0.5,
      transform: {},
    };
    addSymbol(sym);
    setExpanded(false);
  };

   const copySymbol = (index) => {
     let cloneSymbol = { ...symbols[index] };
     addSymbol(cloneSymbol);
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
          Symbols {`(${symbols.length})`}
        </div>
        <AddIcon onClick={onAddSymbol} className={classes.cursorPointer} />
      </div>
      <section {...getCollapseProps()}>
        <InputLabel className="settings-head">Symbols</InputLabel>
        <div
          onClick={setCurrentSymbol}
          className={classes.flexRow}
          style={{ flexWrap: "wrap" }}
        >
          {availableSymbols.map((symbol) => (
            <div
              title={symbol.title}
              style={{
                border:
                  currSymbol === symbol.title &&
                  "2px solid var(--active-border-color)",
              }}
              className={classes.symbol}
            >
              <img
                title={symbol.title}
                width={12}
                src={symbol.src}
                alt={symbol.title}
              />
            </div>
          ))}
        </div>
        <Symbols symbols={symbols} classes={classes} onCopy={copySymbol} />
      </section>
    </div>
  );
};

export default SymbolMenu;
