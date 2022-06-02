import React, { useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Save from "@material-ui/icons/Save";
import Admin from "layouts/Admin.js";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";

import CardBody from "components/Card/CardBody.js";
import { Typography } from "@material-ui/core";
import MenuItem from '@material-ui/core/MenuItem';

import CloudDownload from "@material-ui/icons/CloudDownload";
import Link from 'next/link'
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuList from '@material-ui/core/MenuList';

import { useDispatch, useSelector } from 'react-redux';

import LeftPanel from "../../components/NewDesignPanels/LeftPanel";
import D3panel from "../../components/NewDesignPanels/D3panel"

import DotLoader from "components/loaders/dotLoader";
import { saveAs } from 'file-saver';
import Spinner from "components/loaders/spinner";

import { saveDesign } from "../../lib/actions/designAction";
import Router from "next/router";





const options = ['STL', 'OBJ', 'PNG'];

function newDesign() {

  const dispatch=useDispatch();

  const useStyles = makeStyles({
    infoTip: {
      position: 'absolute',
      left:-10,
      zIndex: "100",
      display: 'flex',
      background:'black',
      color:'white',
      padding:'1rem',
      borderRadius:'8px',
      textAlign: 'center',

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
      border: '2px Solid white',
      transition: '.5s',
      marginRight: '.2rem',
      "&:hover": {
        border: '2px Solid gray',
      }
    },
    stoneShape: {
      width: '1rem',
      height: '1rem',
      borderRadius: '50%',
      cursor: 'pointer',
      border: '2px Solid white',
      transition: '.5s',
      marginRight: '.2rem',
      "&:hover": {
        border: '2px Solid gray',
      }
    },
    img:{
      width: '1rem',
      height: '1rem',
      objectFit:'cover',
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

  const classes = useStyles()




  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const model = useRef()
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [exportLoading, setExportLoading] = useState(false)




  const { loading,designProps } = useSelector(state => state.designProps);


  const handleClick = async() => {
    setExportLoading(true)
    let modelClone = model.current.clone()
    let stoneGroup = modelClone.children.filter(kid=>(kid.type==='Group'&&kid.name==="stoneGroup"))
    modelClone.remove(stoneGroup[0])
    if (selectedIndex === 0) {
      await stlExporter(modelClone)
      setExportLoading(false)
      return 
    }
    if (selectedIndex === 1) {
      await objExporter(modelClone)
      setExportLoading(false)
      return 
    }
    await savePng()
    setExportLoading(false)
  }

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

  const handleSavePost= async ()=>{
    const url = getCanvasImgData()
    let designToSave = {...designProps,url}
    await dispatch(saveDesign(designToSave));
    Router.push("/admin/dashboard");
  }



  // Exporters
  const stlExporter = (model) => {
    import('three/examples/jsm/exporters/STLExporter')
      .then(module => {
        const exporter = new module.STLExporter();
        // let newScene= {...scene}
        let str = exporter.parse(model, { binary: true }); // Export the scene
        let blob = new Blob([str], { type: 'text/plain' }); // Generate Blob from the string
        saveAs(blob, 'export.stl');
      });
  }

  const objExporter = (model) => {
    import('three/examples/jsm/exporters/OBJExporter')
      .then(module => {
        const exporter = new module.OBJExporter();
        let str = exporter.parse(model, { binary: true }); // Export the scene
        let blob = new Blob([str], { type: 'text/plain' }); // Generate Blob from the string
        saveAs(blob, 'export.obj');
      });
  }

const savePng = async () => {
  const dataURL= getCanvasImgData()
  const blob = await fetch(dataURL).then(r => r.blob()); 
  saveAs(blob, 'export.png');
}

const getCanvasImgData=()=>{
  let canvas = document.getElementsByTagName('canvas')[0];
  return canvas.toDataURL('image/png');
}
  return (
    <div>

      <GridContainer spacing={2}>
        <LeftPanel props={{ classes }} />
        <GridItem xs={12} sm={12} md={9}>
          <Card  >
            <CardBody >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Preview</Typography>
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', zIndex: 100 }}>
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

                  
                    <Button size="small" startIcon={<Save />} onClick={handleSavePost}
                      style={{ paddingLeft: '1rem', paddingRight: '1rem', marginLeft: '1rem', color: 'white', background: 'linear-gradient(60deg, #ab47bc, #8e24aa)' }}>
                      Save
                    </Button>
                  
                </div>
              </div>

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