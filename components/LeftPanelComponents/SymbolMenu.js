import React, { useEffect, useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import InputLabel from "@material-ui/core/InputLabel";
import { availableSymbols } from "../NewDesignPanels/panelData";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import Symbols from './Symbols.js'
import Button from "@material-ui/core/Button";
import useCollapse from "react-collapsed";

const SymbolMenu = (props) => {
  const { classes, symbols, addSymbol } = props;
  const { getCollapseProps, getToggleProps, isExpanded, setExpanded } =
    useCollapse();

  const [currSymbol, setCurrSymbol] = useState(availableSymbols[0]);

  const setCurrentSymbol = (e) => {
    let sym = e.target.title;
    if (!sym) return;
    setCurrSymbol(sym);
  };

  const onAddSymbol = () => {
    addSymbol(currSymbol);
    setExpanded(true);
  };

  return (
    <div style={{ marginTop: "1rem" }}>
      <div
        style={{
          width: "100%",
          marginTop: "1rem",
          justifyContent: "space-between",
        }}
        className={classes.flexRow}
      >
        <Button {...getToggleProps()} size="small">
          {isExpanded ? (
            <>
              <KeyboardArrowUpIcon />
            </>
          ) : (
            <>
              <KeyboardArrowDownIcon />
            </>
          )}{" "}
          symbols {`(${symbols.length})`}
        </Button>
        <Button size="small" onClick={onAddSymbol}>
          {" "}
          <AddIcon />
        </Button>
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
                border: currSymbol === symbol.title && "2px solid #8e24aa",
              }}
              className={classes.symbol}
            >
              {symbol.symbol}
            </div>
          ))}
        </div>
        {symbols.map((symbol, i) => (
          <Symbols
            key={i}
            index={i}
            currSymbolShape={currSymbol}
            symbols={symbols}
            classes={classes}
          />
        ))}
      </section>
    </div>
  );
};

export default SymbolMenu;
