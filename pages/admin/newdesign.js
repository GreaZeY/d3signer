import React, { useState, useRef, useEffect } from "react";
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
import { useAlert } from 'react-alert';
import ShareIcon from '@material-ui/icons/Share'
import ReactModal from 'react-modal';
import Fab from '@material-ui/core/Fab';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';

import { makeStyles } from "@material-ui/core/styles";
import Head from 'next/head'
import axios from "axios";
import { subtractGeometry } from '../../components/NewDesignPanels/PendantModel';



const options = ['STL', 'OBJ', 'PNG'];

function newDesign() {
  const alert = useAlert()
  const dispatch = useDispatch();
  console.log()

  const useStyles = makeStyles({
    infoTip: {
      position: 'absolute',
      left: -10,
      zIndex: "100",
      display: 'flex',
      background: 'black',
      color: 'white',
      padding: '1rem',
      borderRadius: '8px',
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
    bailType: {
      borderRadius: '50%',
      cursor: 'pointer',
      border: '3px Solid white',
      transition: '.5s',
      marginRight: '.2rem',
      "&:hover": {
        border: '3px Solid gray',
      }
    },
    img: {
      width: '1rem',
      height: '1rem',
      objectFit: 'cover',

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
    },


    modalStyle: {
      position: 'fixed',
      height: '100vh',
      width: '100vw',
      background: 'rgba(0, 0, 0, 0.514)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000

    },

    containerDiv: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minWidth: '25vw',
      borderRadius: '8px',
      boxSizing: 'border-box',
      flexDirection: 'column',
      background: 'white',
      zIndex: 1000

    }
    ,

    shareIcons: {
      transition: 'transform 0.3s ease-in-out'
    },


    shareLink: {
      // height: '50px',
      width: '50px',
      fontSize: '2rem',
      // margin: '1rem',
      textDecoration: 'none',
      border: '1px solid transparent'
    }
    ,
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      boxSizing: 'border-box',
      padding: '1rem'
    },

    field: {
      '& input': {
        border: 'none',
        outline: 'none',
        fontSize: '15px'
      },
      margin: '1rem 0',
      borderRadius: '4px',
      padding: '0 0 0 5px',
      border: '2px solid #e1e1e1'
    }

    ,
    linksCenter: {
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',

    },
    fabButton: {
      position: 'fixed',
      bottom: 0,
      right: 0,
      background: 'linear-gradient(60deg, #ab47bc, #8e24aa)',

    },

    zoomControls: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      padding: '1rem .5rem',
      zIndex: 10,
      width: '6rem'
    },
    preview: {
      position: 'relative',
      height: '75vh',
      "@media screen and (max-width: 960px)": {
        height: '40vh',

      }
    }



  });

  const classes = useStyles()

  const anchorRef = useRef(null);
  const model = useRef()

  const [modalShow, setModalShow] = useState(false);
  const [url, setUrl] = useState({});
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [exportLoading, setExportLoading] = useState(false)
  const [windowWidth, setWindowWidth] = useState(0)
  const [zoom, setZoom] = useState({ isZooming: false })

  // const [canvasImg, setCanvasImage] = useState(' ')

  const { loading, designProps } = useSelector(state => state.designProps);

  useEffect(() => {
    let decodedUrl = window.location.href;
    setUrl({ decodedUrl, encodedUrl: encodeURI(decodedUrl) });


  }, [])


  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Handler to call on window resize
      function handleResize() {
        // Set window width/height to state
        setWindowWidth(window.innerWidth)
      }

      // Add event listener
      window.addEventListener("resize", handleResize);

      // Call handler right away so state gets updated with initial window size
      handleResize();

      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [])


  const exportFile = async (index) => {
    try {
      if (index === 2) {
        await savePng()
      } else {
        axios.post('/api/downloadcount', { time: Date.now() })
        setExportLoading(true)

        
        let modelClone = model.current.clone()

        let stoneGroup = modelClone.children.filter(kid => (kid.type === 'Group' && kid.name === "stoneGroup"))
        modelClone.remove(stoneGroup[0])

        let minuendMesh = modelClone.children[0].children[0], subtrahendMesh = stoneGroup[0].children[0];
        debugger
          let subtractedGeometry = subtractGeometry(minuendMesh, subtrahendMesh)
        minuendMesh.geometry = subtractedGeometry

        if (index === 0) {
          await stlExporter(modelClone)
          setExportLoading(false)
          return
        }
        if (index === 1) {
          await objExporter(modelClone)
          setExportLoading(false)
          return
        }
      }
      setExportLoading(false)
    } catch (e) {
      console.log(e)
      alert.error(e.message)
      setExportLoading(false)
    }
  }

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    exportFile(index)
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

  const handleSavePost = async () => {
    const url = await getCanvasImgData()
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    let createdAt = dd + '/' + mm + '/' + yyyy;
    let designToSave = { ...designProps, url, createdAt }
    await dispatch(saveDesign(designToSave));
    // Router.push("/admin/dashboard");
    alert.success("Your design has been Saved.");
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url.decodedUrl);

    alert.success('Url is copied to clipboard.');

    // setShowTick(true);

  }


  // Exporters
  const stlExporter = (model) => {
    import('three/examples/jsm/exporters/STLExporter')
      .then(module => {
        const exporter = new module.STLExporter();
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
    const dataURL = await getCanvasImgData()
    const blob = await fetch(dataURL).then(r => r.blob());
    saveAs(blob, 'export.png');
  }

  const getCanvasImgData = async () => {
    let canvas = document.getElementsByTagName('canvas')[0];
    const canvas2d = document.createElement('canvas')
    var context = canvas2d.getContext("2d");
    canvas2d.width = "700"
    canvas2d.height = "500"
    context.font = "12px Rubik";
    const imObjFunction = () => {
      return new Promise((resolve, reject) => {
        var imageObj = new Image();
        imageObj.onload = function () {
          context.drawImage(imageObj, 10, 10);
          context.fillText(`Length: ${designProps.length}`, 600, 20);
          context.fillText(`Width: ${designProps.width}`, 600, 35);
          context.fillText(`Thickness: ${designProps.thickness}`, 600, 50);
          context.fillText(`Stone Size: ${designProps.stoneSize}`, 600, 65);
          resolve(true)
        };
        imageObj.src = canvas.toDataURL('image/png');
      })
    }
    const isDrawn = await imObjFunction()
    // document.body.appendChild(canvas2d)
    if (isDrawn) return canvas2d.toDataURL('image/png');

    canvas2d.remove();
    alert.error('An Error Occurred!')
  }

  return (
    <>
      <Head>
        <title>{`Editing: ${designProps.text}`}</title>
        <meta property="og:title" content={`${designProps.text}`} />
        <meta property="og:url" content={url.decodedUrl} />
        {/* <meta property="og:image" content={canvasImg} /> */}
      </Head>
      <div>

        <GridContainer direction={windowWidth <= 960 ? "column-reverse" : ''}   >
          <LeftPanel props={{ classes }} />
          <GridItem xs={12} sm={12} md={9} style={{ padding: 0 }}  >
            <Card  >
              <CardBody className={classes.preview} >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Preview</Typography>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', zIndex: `${modalShow ? '0' : '100'}` }}>
                    <ButtonGroup variant="text" ref={anchorRef} aria-label="split button">
                      <Button disabled={exportLoading} size="small" style={{ background: 'white', border: '1px solid #ECEBEB ' }} onClick={() => exportFile(selectedIndex)}>
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
                          <Paper >
                            <ClickAwayListener onClickAway={handleClose}>
                              <MenuList id="split-button-menu" autoFocusItem>
                                {options.map((option, index) => (
                                  <MenuItem
                                    key={option}
                                    // style={{ zIndex: '100' }}
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

                    <ShareIcon onClick={() => setModalShow(true)} style={{ paddingLeft: '.5rem', paddingRight: '.5rem', marginLeft: '1rem', cursor: 'pointer' }} />


                    <Button size="small" startIcon={<Save />} onClick={handleSavePost}
                      style={{ paddingLeft: '1rem', paddingRight: '1rem', marginLeft: '1rem', color: 'white', background: 'linear-gradient(60deg, #ab47bc, #8e24aa)' }}>
                      Save
                    </Button>



                    <ReactModal
                      isOpen={modalShow}
                      onRequestClose={() => setModalShow(false)}
                      shouldCloseOnOverlayClick={true}
                      className={classes.modalStyle}
                    >
                      {/* <div>

                      
                      <div className={classes.containerDiv}>

                        
                          <Typography className={classes.symbol}
                           style={{ width: 'auto', padding: '.3rem .8rem', color: 'blue', borderRadius: '8px', cursor: 'text', border: '1px solid grey' }}>
                             {`http://localhost:3000${router.pathname}`} 

                             {showTick?<AnimatedTick scale={0.1}/>:<span onClick={copyToClipboard} class="material-symbols-outlined" 
                          style={{ cursor: 'pointer', color: 'grey', fontSize: '1rem', paddingLeft: '1rem' }} 
                          title="copy">
                            content_copy
                          </span>}
                          </Typography>
                          
                         

                      </div>
                    </div> */}

                      <div className={classes.containerDiv}>
                        <header className={classes.modalHeader}>
                          <div><span style={{
                            fontSize: '21px',
                            fontWeight: 600
                          }}>Share your design</span></div>

                          <div className="close" style={{ fontSize: '2rem', cursor: 'pointer' }} onClick={() => setModalShow(false)}><i class="uil uil-times"></i></div>
                        </header>

                        <div style={{ padding: '0 1.5rem' }}>
                          <div>
                            <p style={{ fontSize: '16px' }}>Share this link via</p>
                            <ul style={{ padding: 0 }} className={classes.linksCenter}>
                              <a href={`https://www.facebook.com/sharer/sharer.php?u=${url.encodedUrl}`} target='_blank' className={classes.shareLink}><i style={{
                                color: '#1877F2',
                                borderColor: '#b7d4fb'
                              }} className={`fab fa-facebook-f ${classes.shareIcons}`}></i></a>
                              <a href={`https://twitter.com/intent/tweet?url=${url.encodedUrl}`} target='_blank' className={classes.shareLink}><i style={{
                                color: '#46C1F6',
                                borderColor: '#b6e7fc'
                              }} className="fab fa-twitter"></i></a>
                              {/* <a href="#" className={classes.shareLink}><i style={{
                              color: ' #e1306c',
                              borderColor: '#f5bccf'
                            }} className="fab fa-instagram"></i></a> */}

                              <a href={`https://t.me/share/url?url=${url.encodedUrl}`} target='_blank' className={classes.shareLink}><i style={{
                                color: '#0088cc',
                                borderColor: '#b3e6ff'
                              }} class="fab fa-telegram-plane"></i></a>

                              <a href={`https://wa.me/?text=${url.encodedUrl}`} data-action="share/whatsapp/share" target='_blank' className={classes.shareLink}><i style={{
                                color: '#25D366',
                                borderColor: '#bef4d2'
                              }} className="fab fa-whatsapp"></i></a>
                            </ul>
                          </div>

                          <p style={{ marginBottom: 0 }}>Or copy link</p>
                          <div className={classes.field}>
                            <i className="url-icon uil uil-link"></i>
                            <input type="text" readonly value={url.decodedUrl} />
                            <span onClick={copyToClipboard} class="material-symbols-outlined"
                              style={{
                                transform: 'translateY(4px)',
                                cursor: 'pointer', color: 'grey', fontSize: '1.2rem'
                              }}
                              title="copy">
                              content_copy
                            </span>
                          </div>
                        </div>
                      </div>
                    </ReactModal>
                  </div>
                </div>

                <div className={classes.zoomControls + ' ' + classes.flexRow} style={{ justifyContent: 'space-between' }} >
                  <Fab aria-label="add" size="small"
                    onPointerDown={() => setZoom({ isZooming: true, mode: '+' })}
                    onPointerUp={() => setZoom({ ...zoom, isZooming: false })}
                  >
                    <ZoomInIcon />
                  </Fab>
                  <Fab aria-label="add" size="small"
                    onPointerDown={() => setZoom({ isZooming: true, mode: '-' })}
                    onPointerUp={() => setZoom({ ...zoom, isZooming: false })}
                  >
                    <ZoomOutIcon />
                  </Fab>
                </div>

                <D3panel model={model} zoom={zoom} />
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
      {/* {
        windowWidth <= 960 && <Fab className={classes.fabButton} 
        variant="extended" 
        onClick={() => window.scrollTo(0, document.body.scrollHeight)} >
          <SettingsIcon />
        </Fab>
      } */}
    </>
  );
}

newDesign.layout = Admin;

export default newDesign;
