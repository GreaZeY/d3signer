import React, { useEffect, useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Save from "@material-ui/icons/Save";
import Admin from "layouts/Admin.js";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import CardBody from "components/Card/CardBody.js";
import { Typography } from "@material-ui/core";
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Slider from '@material-ui/core/Slider';
import CloudDownload from "@material-ui/icons/CloudDownload";
import Link from 'next/link'
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuList from '@material-ui/core/MenuList';
import Bail from "components/Bails/Bail";
import { useDispatch, useSelector } from 'react-redux';
import { designProps } from "../../lib/actions/designAction"
import D3panel from "../../components/D3panel/d3panel"
import { fonts } from "components/D3panel/assets/allFonts"
import { DESIGN_PROPS_REQUEST } from "../../lib/constants/designPropsConstants"
import DotLoader from "components/loaders/dotLoader";
import { saveAs } from 'file-saver';
import Spinner from "components/loaders/spinner";
import AddIcon from '@material-ui/icons/Add';

import useCollapse from 'react-collapsed'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';




const options = ['STL', 'OBJ', 'PNG'];

function newDesign() {

  const useStyles = makeStyles({
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      height: '100vh',
      width: '100vw',
      backgroundColor: "rgba(77,77,77,0.6)",
      zIndex: "100",
      display: 'flex',
      // alignItems: 'center',

    },
    flexRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    main: {
      display: 'flex',
      width: '100%',
      justifyContent: 'center',
      "@media screen and (max-width: 640px)": {
        flexDirection: 'column',
      }
    },
    settings: {
      padding: '1rem',
    },
    preview: {
      padding: '1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: '.5rem',
      "@media screen and (max-width: 640px)": {
        marginLeft: 0,

      }
    },
    base: {
      width: '1rem',
      height: '1rem',
      borderRadius: '50%',
      cursor: 'pointer',
      border: '1px Solid white',
      transition: '.5s',
      marginRight: '.2rem',
      "&:hover": {
        border: '1px Solid gray',
      }
    },
    symbol: {
      border: '1px solid #ECEBEB',
      width: '1rem',
      height: '1rem',
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      transition: '.5s',
      justifyContent: 'center',
      marginRight: '.2rem',
      color: 'gray',
      fontSize: '12px',
      "&:hover": {
        border: '1px Solid gray',

      }
    },
    formMargin0: {
      marginTop: '0rem !important',
      marginBottom: '1rem !important'
    },
    loaderContainer: {
      height: "calc(100-10)% !important",
      background: 'black',
      position: 'absolute',
      top: "50%",
      left: "50%",
      transform: "translate(-50%,-50%)",
      zIndex: 100
    },
    delete: {
      marginTop: '.7rem',
      cursor: 'pointer',
      transition: '.3s',
      "&:hover": {
        color: 'red'
      }
    }
  });



  const [text, setText] = useState('greazey');                  //Vıcky
  const [Crimping1, setCrimping1] = useState('None');
  const [Crimping2, setCrimping2] = useState('None');
  const [length, setLength] = useState(20);
  const [width, setWidth] = useState(5);
  const [base, setBase] = useState('#FFC900');
  const [thickness, setThickness] = useState(4);
  const [currSizeProp, setCurrSizeProp] = useState('Length');
  const [bails, bailsCount] = useState([]);

  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [exportLoading, setExportLoading] = useState(false)
  const [symbol, setSymbol] = useState('');


  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.designProps)

  const handleClick = () => {
    if (selectedIndex === 0) {
      stlExporter()
      return
    }
    objExporter()

  };

  const setBailNumber = () => {
    let bailArr = [...bails]
    bailArr.length++
    bailArr[bailArr.length - 1] = { position: [0, 0, 0], sizes: {} }
    bailsCount(bailArr)
    setExpanded(true)
  };

  console.log(bails)

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };



  const [font, setFont] = useState(fonts[0].familyName);




  const setSizes = (e, val) => {
    currSizeProp === 'Length' ?
      setLength(val)
      :
      (
        currSizeProp === 'Width' ?
          setWidth(val) : setThickness(val)
      )
  }

  const handleChange = (event) => {
    setCrimping1(event.target.value);
  };
  const handleChange2 = (event) => {
    setCrimping2(event.target.value);
  };

  const classes = useStyles();

  const getText = e => {
    let txt = e.target.value
    txt = txt.replace(' ', '')
    setText(txt)
  }

  // dispatching desing's properties
  useEffect(() => {
    dispatch({ type: DESIGN_PROPS_REQUEST });
    dispatch(designProps({
      text,
      base,
      length,
      width,
      thickness,
      font,
      bails,
      symbol
    }))
  }, [text, base, font, length, width, thickness, bails, symbol])



  // bail expand and collapse 
  const { getCollapseProps, getToggleProps, isExpanded, setExpanded } = useCollapse()


  // Exporters
  const model = useRef()

  const stlExporter = () => {
    setExportLoading(true)
    import('three/examples/jsm/exporters/STLExporter')
      .then(module => {
        const exporter = new module.STLExporter();
        // let newScene= {...scene}
        let str = exporter.parse(model.current, { binary: true }); // Export the scene
        let blob = new Blob([str], { type: 'text/plain' }); // Generate Blob from the string
        saveAs(blob, text ? text + '.stl' : 'export.stl');
        setExportLoading(false)
      });
  }

  const objExporter = () => {
    setExportLoading(true)
    import('three/examples/jsm/exporters/OBJExporter')
      .then(module => {
        const exporter = new module.OBJExporter();
        // let newScene= {...scene}
        let str = exporter.parse(model.current, { binary: true }); // Export the scene
        let blob = new Blob([str], { type: 'text/plain' }); // Generate Blob from the string
        saveAs(blob, text ? text + '.obj' : 'export.obj');
        setExportLoading(false)
      });
  }

  return (
    <div>

      <GridContainer spacing={2}>
        <GridItem xs={12} sm={12} md={3}>
          <Card >
            <CardBody>

              <Typography>Settings</Typography>
              <CustomInput
                labelText="Text (Your Name)"
                id="text"
                inputProps={{
                  onChange: getText,
                  value: text,
                  maxLength: 10
                }}
                formControlProps={{
                  fullWidth: true,
                  marginTop: 0
                }}
              />






              {fonts.length && <FormControl style={{ width: '100%', marginTop: '1rem' }}>
                <InputLabel >Font</InputLabel>
                <Select
                  value={font}
                  label="font"
                  onChange={(e) => setFont(e.target.value)}
                >

                  {fonts.map(ff => <MenuItem key={ff.familyName} value={ff.familyName}  >{ff.familyName}</MenuItem>)

                  }
                </Select>
              </FormControl>}

              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ marginTop: '1rem', marginRight: '2rem', justifyContent: 'space-between' }} className={classes.flexRow}>
                  <FormControl sx={{ m: 1, minWidth: 120 }} size="small"  >
                    <InputLabel >Sizes</InputLabel>
                    <Select
                      size="small"
                      value={currSizeProp}
                      label="Size"
                      onChange={(e => setCurrSizeProp(e.target.value))}
                    >
                      <MenuItem value={'Length'}>Length</MenuItem>
                      <MenuItem value={'Width'}>Width</MenuItem>
                      <MenuItem value={'Thickness'}>Thickness</MenuItem>
                    </Select>
                  </FormControl>

                </div>
                <div style={{ marginTop: '2rem', width: '100%' }} className={classes.flexRow} >
                  <Slider
                    aria-label="Sizes"
                    onChange={setSizes}
                    style={{ marginRight: '1rem' }}
                    min={currSizeProp === 'Length' ? 20 : 1}
                    max={currSizeProp === 'Length' ? 30 : 10}
                    value={currSizeProp === 'Length' ?
                      length
                      :
                      (
                        currSizeProp === 'Width' ?
                          width : thickness
                      )
                    }
                    color="primary"
                  />
                  <input onChange={e => setSizes(e, parseInt(e.target.value))} style={{ padding: '.2rem', cursor: 'text' }} type='number' maxLength={100} minLength={1} className={classes.symbol} value={currSizeProp === 'Length' ?
                    length
                    :
                    (
                      currSizeProp === 'Width' ?
                        width : thickness
                    )} />
                </div>
              </div>

              <div style={{ marginTop: '1rem' }}  >

                <InputLabel className="settings-head">Your Base</InputLabel>
                <div onClick={(e) => setBase(e.target.style.background)} className={classes.flexRow}>
                  <div className={classes.base} style={{ background: '#FFC900' }} ></div>
                  <div className={classes.base} style={{ background: '#B76E79' }} ></div>
                  <div className={classes.base} style={{ background: '#C0C0C0' }} ></div>
                </div>


              </div>
              <div style={{ marginTop: '1rem' }}  >
                <div>
                  <InputLabel className="settings-head">Add Symbol</InputLabel>
                  <div onClick={(e) => setSymbol(e.target.innerHTML)} className={classes.flexRow}>
                    <div name='heart' className={classes.symbol}  >♡</div>
                    <div className={classes.symbol}  >#</div>
                    <div className={classes.symbol}  >☆</div>
                    <div className={classes.symbol}  >∞</div>
                    <div className={classes.symbol}  >&</div>
                  </div>
                </div>
              </div>

              <FormControl style={{ width: '100%', marginTop: '1rem' }}>
                <InputLabel >Crimping#1</InputLabel>
                <Select
                  value={Crimping1}
                  label="Crimping#1"
                  onChange={handleChange}
                >
                  <MenuItem value="None">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>White Diamond</MenuItem>
                  <MenuItem value={20}>Black Stone</MenuItem>
                  <MenuItem value={30}>Ruby</MenuItem>
                </Select>
              </FormControl>
              <br />


              <FormControl style={{ width: '100%', marginTop: '1rem' }}>
                <InputLabel >Crimping#2</InputLabel>
                <Select
                  value={Crimping2}
                  label="Crimping#2"
                  onChange={handleChange2}
                >
                  <MenuItem value="None">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>Mix & Match</MenuItem>
                  <MenuItem value={20}>Jean Blue Stones</MenuItem>
                  <MenuItem value={30}>White Stones</MenuItem>
                </Select>

              </FormControl>

              {/* <Button onClick={() => setShowBailModal(true)} style={{ width: '100%', marginTop: '1rem' }} size="small" variant="outlined" >
                Configure Bail
              </Button> */}


              <div>
                {/* <button {...getToggleProps()}> */}
                <div style={{ width: '100%', marginTop: '1rem', justifyContent: 'space-between' }} className={classes.flexRow}>
                  <Button disabled={true} {...getToggleProps()} size="small" >


                    {(isExpanded ? <><KeyboardArrowUpIcon /></> : <><KeyboardArrowDownIcon /></>) } Bails {`(${bails.length})`}
                    {/* Bails */}
                  </Button>
                  <Button size="small" onClick={setBailNumber} > <AddIcon /></Button>
                </div>
                <section {...getCollapseProps()}>

                  {bails.map((bail, i) => <Bail key={i} index={i} bails={bails} setBailsData={bailsCount} classes={classes} />)
                  }
                </section>
              </div>



            </CardBody>
          </Card>

        </GridItem>

        <GridItem xs={12} sm={12} md={9}>
          <Card  >
            <CardBody >


              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Preview</Typography>


                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', zIndex: 100 }}>
                  {/* 
                      <Button size="small" variant="outlined" startIcon={<CloudDownload />}>
                        STL
                      </Button>
                      <Button style={{ marginLeft: '1rem' }} size="small" variant="outlined" startIcon={<CloudDownload />}>
                        OBJ
                      </Button> */}



                  <ButtonGroup variant="text" ref={anchorRef} aria-label="split button">
                    <Button disabled={exportLoading} size="small" style={{ background: 'white', border: '1px solid #ECEBEB ' }} onClick={handleClick}>
                      {
                        exportLoading ?
                          <Spinner style={{ width: '.7rem', height: '.7rem', marginRight: '.5rem' }} />
                          :
                          <CloudDownload style={{ marginTop: '0px', marginRight: '.5rem' }} />

                      } {options[selectedIndex]}</Button>
                    <Button
                      size="small"
                      style={{ background: 'white', border: '1px solid #ECEBEB ' }}
                      aria-controls={open ? 'split-button-menu' : undefined}
                      aria-expanded={open ? 'true' : undefined}
                      aria-label="select merge strategy"
                      aria-haspopup="menu"
                      onClick={handleToggle}
                      disabled={exportLoading}
                    >
                      <ArrowDropDownIcon />
                    </Button>
                  </ButtonGroup>
                  <Popper
                    open={open}
                    anchorEl={anchorRef.current}
                    role={undefined}
                    transition
                    disablePortal
                  >
                    {({ TransitionProps, placement }) => (
                      <Grow
                        {...TransitionProps}
                        style={{
                          transformOrigin:
                            placement === 'bottom' ? 'center top' : 'center bottom',
                        }}
                      >
                        <Paper style={{ zIndex: '100' }}>
                          <ClickAwayListener onClickAway={handleClose}>
                            <MenuList id="split-button-menu" style={{ zIndex: '100' }} autoFocusItem>
                              {options.map((option, index) => (
                                <MenuItem
                                  key={option}
                                  style={{ zIndex: '100' }}
                                  selected={index === selectedIndex}
                                  onClick={(event) => handleMenuItemClick(event, index)}
                                ><CloudDownload style={{ marginTop: '0px', marginRight: '.5rem' }} />
                                  {option}
                                </MenuItem>
                              ))}
                            </MenuList>
                          </ClickAwayListener>
                        </Paper>
                      </Grow>
                    )}
                  </Popper>







                  <Link href="/admin/dashboard">
                    <Button size="small" startIcon={<Save />}
                      style={{ paddingLeft: '1rem', paddingRight: '1rem', marginLeft: '1rem', color: 'white', background: 'linear-gradient(60deg, #ab47bc, #8e24aa)' }}>
                      Save
                    </Button>
                  </Link>
                </div>
              </div>



              {/* <img style={{ height: '350px' }} src="https://m.media-amazon.com/images/I/512PpEywN-L._UL1001_.jpg" /> */}

              <D3panel model={model} />
              {
                loading && <div className={classes.loaderContainer} >
                  <DotLoader />
                </div>
              }

            </CardBody>
          </Card>
        </GridItem>

      </GridContainer>



    </div>
  );
}

newDesign.layout = Admin;

export default newDesign;